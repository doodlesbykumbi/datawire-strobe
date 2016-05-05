package quark_improvements 1.0.0;

namespace quark {
  macro nice.BoundMethod bind(Object target, String method) (new nice.BoundMethod((target), (method)));

  namespace nice {
    interface Callable {
      Object invoke(List<Object> args);
    }

    interface Bindable { // move this to quark.Object
      macro BoundMethod __method__(String method) bind((self), ($method))
    }
    
    class BoundMethod extends Callable {
      Object target;
      reflect.Method method;
      BoundMethod(Object target, String methodName) {
        self.target = target;
        self.method = target.getClass().getMethod(methodName);
      }
      AppliedMethod apply(List<Object> args) {
        return new AppliedMethod(self, args);
      }
      Object invoke(List<Object> args) {
        return self.method.invoke(self.target, args);
      }
    }

    class ListUtils {
      static List<Object> copy (List<Object> orig) {
        List<Object> ret = new List<Object>();
        return extend(ret, orig);
      }
      static List<Object> extend(List<Object> orig, List<Object> extra) {
        int i = 0;
        while (i < extra.size()) {
          orig.add(extra[i]);
        }
        return orig;
      }
    }

    class AppliedMethod extends Callable {
      BoundMethod method;
      List<Object> args;
      AppliedMethod(BoundMethod method, List<Object> args) {
        self.method = method;
        self.args = args;
      }
      Object invoke(List<Object> args) {
        return self.method.invoke(ListUtils.extend(ListUtils.copy(self.args), args));
      }
    }

    class FutureCallable extends concurrent.FutureListener {
      Callable target;
      List<Object> context;
      FutureCallable(Callable target, List<Object>context) {
        self.target = target;
        self.context = context;
      }
      void onFuture(concurrent.Future fut) {
        self.target.invoke(ListUtils.extend([fut], self.context));
      }
    }

    class Future extends concurrent.Future {
      void then(Callable target, List<Object> context) {
        self.onFinished(new FutureCallable(target, context));
      }
    }
  }

  namespace examples {
   class Join extends nice.Future, nice.Bindable {
     List<nice.Future> results;
     List<int> log;
     Join(List<nice.Future> inputs) {
       self.results = inputs;
       self.log = new List<int>();
       check(null);
       int i = 0;
       while (i < self.results.size()) {
                 // make compiler emit self.join as self.__method__("join")
         inputs[i].then(self.__method__("join"), [i]);
       }
     }
     void join(nice.Future input, int i) {
       self.log.add(i);
       check(input.getError());
     }
     void check(String error) {
       if (error != null) {
         self.finish(error);
       }
       if (self.log.size() == self.results.size()) {
         self.finish(error);
       }
     }
   }
 }
}