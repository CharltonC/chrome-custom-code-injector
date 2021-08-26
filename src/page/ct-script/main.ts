import { codeRunnerHandle } from '../../handle/code-runner';
import { chromeHandle } from '../../handle/chrome';

(async () => {
    const { rules } = await chromeHandle.getState() || {};
    if (!rules?.length) return;
    codeRunnerHandle.init(rules);
})();
