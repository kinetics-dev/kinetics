/* -------------------------------------------------------------------------- */
/*                                   Logger                                   */
/* -------------------------------------------------------------------------- */
const DEFAULT_CONTEXT = "KINETICS";

export const warn = (message: string, context = DEFAULT_CONTEXT) => {
  console.warn("\x1b[33m%s\x1b[0m", `[${context}] ` + message);
};

/* -------------------------------------------------------------------------- */
/*                                State Manager                               */
/* -------------------------------------------------------------------------- */
const stateManager = Object.seal({
  shouldPrintDeprecationWarning: true,
  suppressDeprecationWarning() {
    stateManager.shouldPrintDeprecationWarning = false;
  },
});

export const { shouldPrintDeprecationWarning, suppressDeprecationWarning } =
  stateManager;
