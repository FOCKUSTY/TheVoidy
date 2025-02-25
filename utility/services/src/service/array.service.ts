/* eslint-disable */

class SelfArray extends Array {
  public static Shuffle = (array: any[]) => {
    let currentIndex = array.length,
      randomIndex;

    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  };

  public static Copy<T>(obj: any): T {
    function copyProps(clone: any) {
      for (const key in obj)
        if (Object.prototype.hasOwnProperty.call(obj, key)) clone[key] = SelfArray.Copy(obj[key]);
    }

    function cloneObj(): any {
      const clone = {};
      copyProps(clone);
      return clone;
    }

    function cloneArr(): any {
      return obj.map(function (item: any) {
        return SelfArray.Copy(item);
      });
    }

    function cloneMap(): any {
      const clone = new Map();
      for (const [key, val] of obj) clone.set(key, SelfArray.Copy(val));
      return clone;
    }

    function cloneSet(): any {
      const clone = new Set();
      for (const item of obj) clone.add(SelfArray.Copy(item));
      return clone;
    }

    function cloneFunction(this: any): any {
      const clone = obj.bind(this);
      copyProps(clone);
      return clone;
    }

    const type = Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();

    switch (type) {
      case "object":
        return cloneObj();

      case "array":
        return cloneArr();

      case "map":
        return cloneMap();

      case "set":
        return cloneSet();

      case "function":
        return cloneFunction();
    }

    return obj;
  }
}

export default SelfArray;
