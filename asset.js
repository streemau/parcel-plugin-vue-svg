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

    this.code = Buffer.from(optimizedSvg.data).toString('base64');
  }

  render() {
    return `
      module.exports = {
        functional: true,
        render(createElement) {
          return createElement('img', {
            attrs: {
              src: 'data:image/svg+xml;base64,${this.code}'
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
