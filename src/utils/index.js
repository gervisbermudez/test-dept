export const storage = {
  get: (key) => {
    if (typeof window !== "undefined") {
      try {
        let v;
        if (localStorage.getItem(key)) {
          if (key === "lines") {
            const aux = localStorage.getItem(key)?.toString();
            v = JSON.parse(aux || "");
          } else {
            v = JSON.parse(localStorage.getItem(key) || "");
          }
          // v = JSON.parse(localStorage.getItem(key) || '');

          return v;
        } else {
          localStorage.removeItem(key);
          v = null;
          return v;
        }
      } catch (e) {
        localStorage.removeItem(key);
        return null;
      }
    } else {
      return null;
    }
  },
  set: (key, value) => {
    if (typeof window !== "undefined") {
      try {
        if (key === "lines") {
          const newValue = JSON.stringify(value);
          localStorage.setItem(key, newValue);
          return JSON.stringify(newValue);
        } else {
          localStorage.setItem(key, JSON.stringify(value));
          return JSON.stringify(value);
        }
        // localStorage.setItem(key, JSON.stringify(value));
        // return JSON.stringify(value);
      } catch (e) {
        return null;
      }
    } else {
      return null;
    }
  },
  remove: (key) => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(key);
      } catch (e) {}
    }

    return null;
  },
};
