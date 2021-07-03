function createDomBinding({
  initialData,
  bindingPrefix,
  typeErrorCheck,
  setDomValue,
  eventName,
}) {
  const data = {};

  Object.entries(initialData).forEach((entry) => {
    const [entryKey, initialValue] = entry;

    if (typeof typeErrorCheck === "function") {
      typeErrorCheck(initialValue);
    }

    const domSelector = `[data-${bindingPrefix}="${entryKey}"]`;
    const domElement = document.querySelector(domSelector);

    if (!domElement) {
      throw new Error(`Could not find '${domSelector}' in HTML`);
    }

    let internalValue = initialValue;
    setDomValue({ el: domElement, value: initialValue });

    if (eventName) {
      domElement.addEventListener(eventName, function () {
        internalValue = this.value;
      });
    }

    Object.defineProperty(data, entryKey, {
      enumerable: true,
      configurable: true,
      get() {
        return internalValue;
      },
      set(newValue) {
        if (typeof typeErrorCheck === "function") {
          typeErrorCheck(newValue);
        }

        internalValue = newValue;
        setDomValue({ el: domElement, value: newValue });
      },
    });
  });

  return data;
}

function createInputBinding(initialData) {
  return createDomBinding({
    initialData,
    bindingPrefix: "input",
    eventName: "input",
    setDomValue: ({ value, el }) => {
      el.value = value;
    },
  });
}

function createBooleanBinding(initialData) {
  const initialDisplayValue = { ...initialData };
  Object.keys(initialDisplayValue).forEach((key) => {
    const el = document.querySelector("[data-bool]");
    initialDisplayValue[key] = window
      .getComputedStyle(el)
      .getPropertyValue("display");
  });

  return createDomBinding({
    initialData,
    bindingPrefix: "bool",
    typeErrorCheck: (value) => {
      const valueType = typeof value;

      if (valueType !== "boolean") {
        throw new TypeError(
          `Expected '${value}' to be a 'boolean'. Got '${valueType}'`
        );
      }
    },
    setDomValue: ({ value, el }) => {
      if (value) {
        el.style.display = initialDisplayValue[el.getAttribute("data-bool")];
      } else {
        el.style.display = "none";
      }
    },
  });
}

function createTemplateBinding(initialData) {
  return createDomBinding({
    initialData,
    bindingPrefix: "template",
    setDomValue: ({ value, el }) => {
      el.textContent = value;
    },
  });
}
