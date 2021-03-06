const Dependency = require('webpack/lib/Dependency');
const WebpackMissingModule = require('webpack/lib/dependencies/WebpackMissingModule');

class RequireDynamicContextDependency extends Dependency {
  constructor(range, valueRange, inArray) {
    super();
    this.range = range;
    this.valueRange = valueRange;
    this.inArray = inArray;
  }

  getResourceIdentifier() {
    return `openui5 dynamic require`;
  }

  get type() {
    return 'openui5 dynamic require';
  }
}

RequireDynamicContextDependency.Template = class RequireDynamicContextDependencyTemplate {
  apply(dep, source) {
    // const containsDeps = dep.module && dep.module.dependencies && dep.module.dependencies.length > 0;
    // if (containsDeps) {
    if (dep.module) {
      if (dep.inArray) {
        source.replace(dep.valueRange[1], dep.valueRange[1], `.map(function(item) { return __webpack_require__(${JSON.stringify(dep.module.id)})(item, true); })`);
      } else {
        source.replace(dep.valueRange[1], dep.range[1] - 1, `)`);
        source.replace(dep.range[0], dep.valueRange[0] - 1, `__webpack_require__(${JSON.stringify(dep.module.id)})(`);
      }
    } else {
      const content = WebpackMissingModule.module('Could not find OpenUI5 dynamic dependency module');
      source.replace(dep.range[0], dep.range[1] - 1, content);
    }
  }
};

module.exports = RequireDynamicContextDependency;
