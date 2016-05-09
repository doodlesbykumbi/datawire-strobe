#!/usr/bin/env python
import logging
import subprocess, re, os
from semantic_version import Version

dry_run = True

class Subprocess(object):
    log = logging.getLogger("subprocess")
    @classmethod
    def check_output(cls, *args, **kwargs):
        cls.log.debug("invoking %s" % args[0])
        return subprocess.check_output(*args, **kwargs)

class GitRelease(object):
    """Find last release tag for the given commit or master branch by default """

    log = logging.getLogger("GitRelease")

    def __init__(self, branch = "origin/master"):
        self.branch = branch
        self._tag = None
        self._version = None

    @property
    def tag(self):
        """Name of last release tag"""
        if self._tag is None:
            out = Subprocess.check_output([
                "git", "describe", "--abbrev=0", "--match=v[0-9]*", self.branch
                ])
            self._tag = out.strip()
            self.log.debug("tag of %s was %s" % (self.branch, self._tag))
        return self._tag

    @property
    def version(self):
        """Version of the last release"""
        if self._version is None:
            self._version = Version(self.tag[1:])
            self.log.debug("Git version of %s was %s" % (self.branch, self._version))
        return self._version

class VersionDelta(object):
    def __init__(self, scale, xform, tag):
        self.scale = scale
        self.xform = xform
        self.tag = tag
        self.delta = scale

    def __cmp__(self, other):
        if self.scale < other.scale:
            return -1
        elif self.scale > other.scale:
            return 1
        else:
            return 0

    def __unicode__(self):
        return "<VersionDelta %s>" % self.tag

    def __str__(self):
        return unicode(self)

class GitDelta(object):
    """ how new commits affect project version """
    log = logging.getLogger("change_impact")
    FIX   = VersionDelta( (0,0,1), Version.next_patch, "[FIX]")
    MINOR = VersionDelta( (0,1,0), Version.next_minor, "[MINOR]")
    MAJOR = VersionDelta( (1,0,0), Version.next_major, "[MAJOR]")

    def __init__(self, last_release,
                 branch="origin/develop", reduced_zero=True, commit_map=None,
                 pre_release=None, build=None):
        self.last_release = last_release
        self.pre_release = pre_release
        self.build = build
        self.branch = branch
        self.commit_map = commit_map

        if reduced_zero and (self.last_release.version.major == 0):
            self.log.debug("While the project is in %s version, all changes have reduced impact" % self.last_release.version)
            self.MAJOR.xform = self.MINOR.xform
            self.MAJOR.delta = self.MINOR.delta
            self.MINOR.xform = self.FIX.xform
            self.MINOR.delta = self.FIX.delta

    def commits(self):
        for line in Subprocess.check_output(
            "git log --reverse --oneline".split() + [
                self.branch,
                "--not",
                self.last_release.tag,
                ]).splitlines():
            commit, subject = line.split(" ",1)

            if self.commit_map and (commit in self.commit_map):
                subject = self.commit_map[commit]

            yield commit, subject

    def commit_deltas(self):
        for commitID, subject in self.commits():
            delta = self.FIX
            source = "by default"

            for commitDelta in [self.MAJOR, self.MINOR, self.FIX]:
                if commitDelta.tag in subject:
                    delta = commitDelta
                    source = "from commit message"
                    break

            self.log.debug("commit %s: %s %s\n-- [%s]" % (commitID, commitDelta.tag, source, subject))

            yield delta, commitID, subject

    def version_change(self):
        finalDelta = None
        commits = []

        for delta, commitID, subject in self.commit_deltas():
            self.log.debug("folding %s: %s" % (commitID, delta))

            commits.append((delta, commitID, subject))

            if finalDelta is None:
                self.log.debug("%s: initial change %s" % (commitID, delta))
                finalDelta = delta
            elif delta > finalDelta:
                self.log.debug("%s: %s overrides %s" % (commitID, delta, finalDelta))

                finalDelta = delta

        assert commits, "no commits found, no point in releasing"

        self.log.debug("folding %d commit%s into %s: delta %s" % 
                       (len(commits), "" if len(commits) == 1 else "s", 
                        finalDelta, finalDelta.delta))

        return finalDelta, commits

    @property
    def next_version(self):
        version = self.last_release.version
        self.log.debug("version start: %s" % version)

        finalDelta, commits = self.version_change()
        self.log.debug("final commit list: %s" % commits)
        self.log.debug("final change:      %s %s" % (finalDelta, finalDelta.delta))

        version = finalDelta.xform(version)

        if self.pre_release:
            version.prerelease = (self.pre_release,)

        if self.build:
            version.build = (self.build,)

        self.log.debug("version has to change from %s to %s" %
                       (self.last_release.version, version))

        return version

if __name__ == '__main__':
    from docopt import docopt

    __doc__ = """versioner.py

    Manipulate version tags

    Usage: 
        versioner.py [-n] [--pre=<pre-release-tag>] [--build=<build-tag>]
    """

    args = docopt(__doc__, version="versioner {0}".format("0.1.0"))

    dryrun = args["-n"]

    logging.basicConfig(level=logging.INFO)

    master = GitRelease()
    delta = GitDelta(master, pre_release=args['--pre'], build=args['--build'])

    print delta.next_version

