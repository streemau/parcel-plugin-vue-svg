const { Asset } = require('parcel-bundler');
const SVGO = require('svgo');

class VueSvgAsset extends Asset {
  constructor(name, pkg, options) {
    super(name, pkg, options);
    this.type = 'js';
  }

  async parse(str) {
    const svgo = new SVGO();

    const optimizedSvg = await svgo.optimize(str);

    this.code = optimizedSvg.data;
  }

  render() {
    return `
      module.exports = {
        functional: true,
        render(createElement) {
          return createElement('div', {
            domProps: {
              innerHTML: '${this.code}',
            },
          });
        }
      };
    `;
  }

  generate() {
    return {
      'js': this.render(),
    };
  }
}

module.exports = VueSvgAsset;
