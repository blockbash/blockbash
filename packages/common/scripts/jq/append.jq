# append/0 adds an array of compatible objects by appending the arrays at array-valued keys.
# For example:
#   [{"id":"John", "a":[1]}, {"id":"John", "a":[2], "b":"B"}] | append
# produces an object equal to {"id":"John", "a":[1,2], "b":"B"}
#
# The objects are deemed to be compatible if the values at a given key
# are all identical or all arrays, except that if an object does not have a
# particular key, it is ignored with respect to compatibility-checking
# for that key.  If a key is found to have incompatible values, an
# exception is raised.
#
def append:
  def pair(a;b):
    def compatible(k):
      if (a|has(k)) and (b|has(k))
      then if ((a[k]|type) == "array" and (b[k]|type) == "array") then "array"
           else a[k] == b[k]
       end
      else 1
      end;

    reduce (((a|keys) + (b|keys)) | unique)[] as $key
      ({};
       compatible($key) as $compatible
       | if $compatible
         then .[$key] =
           if (a|has($key))
       then if $compatible == "array" then a[$key] + b[$key]
                else a[$key]
                end
           else b[$key]
       end
     else error("incompatible values at \($key)")
     end);

   reduce .[] as $o ({}; . as $in | pair($in; $o));

def append(f): map(f) | append;
