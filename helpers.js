function createDOMBinding(initial) {
  const templateData = {};

  function handleBoolean(data, k, v) {
    const selector = `[data-show="${k}"]`;
    const el = document.querySelector(selector);
    const toggle = (flag, el) => {
      // console.log(flag, el);
      if (flag) {
        el.style.display = "unset";
      } else {
        el.style.display = "none";
      }
    };

    let internalVal = v;
    toggle(v, el);

    Object.defineProperty(templateData, k, {
      enumerable: true,
      configurable: true,
      get() {
        return internalVal;
      },
      set(val) {
        internalVal = !!val;
        toggle(internalVal, el);
      },
    });
  }

  Object.entries(initial).forEach(([k, v]) => {
    if (typeof v === "boolean") {
      handleBoolean(templateData, k, v);
      return;
    }

    const selector = `[data-template="${k}"]`;
    const el = document.querySelector(selector);

    if (!el) {
      throw new Error(`${selector} not found`);
    }

    let internalVal = v;

    if (el.value !== undefined) {
      el.value = v;
      el.addEventListener("input", function () {
        internalVal = this.value;
      });
    } else {
      el.textContent = v;
    }

    Object.defineProperty(templateData, k, {
      enumerable: true,
      configurable: true,
      get() {
        return internalVal;
      },
      set(newVal) {
        internalVal = newVal;

        if (el.value === undefined) {
          el.textContent = newVal;
        } else {
          el.value = newVal;
        }
      },
    });
  });

  return templateData;
}
