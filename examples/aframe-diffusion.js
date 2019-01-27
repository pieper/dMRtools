function aframe_diffusion() {

  /**
   * Based on aframe-instancing:
   * @author Takahiro / https://github.com/takahirox
   */

  if (typeof AFRAME === 'undefined') {
    throw new Error('Component attempted to register before' +
                    'AFRAME was available.');
  }

  AFRAME.registerComponent('diffusion', {
    schema: {
      count: {type: 'int', default: 10000},
      particleSize: {type: 'float', default: 1.0},
      fieldSize: {type: 'float', default: 100.0},
    },

    init: function () {
      this.count = this.data.count;
      this.particleSize = this.data.particleSize;
      this.fieldSize = this.data.fieldSize;
      this.model = null;
    },

    update: function () {
      if (this.model !== null) { return; }

      let count = this.count;
      let fieldSize = this.fieldSize;

      let geometry = new THREE.InstancedBufferGeometry();
      geometry.copy(new THREE.SphereBufferGeometry(this.particleSize));

      let translateArray = new Float32Array(count*3);
      let vectorArray = new Float32Array(count*3);
      let colorArray = new Float32Array(count*3);

      for (let i = 0; i < count; i++) {
        translateArray[i*3+0] = (Math.random() - 0.5) * fieldSize;
        translateArray[i*3+1] = (Math.random() - 0.5) * fieldSize;
        translateArray[i*3+2] = (Math.random() - 0.5) * fieldSize;
      }

      console.log(fieldSize);

      for (let i = 0; i < count; i++) {
        vectorArray[i*3+0] = (Math.random() - 0.5) * fieldSize;
        vectorArray[i*3+1] = (Math.random() + 1.5) * fieldSize;
        vectorArray[i*3+2] = (Math.random() - 0.5) * fieldSize;
      }

      for (let i = 0; i < count; i++) {
        colorArray[i*3+0] = Math.random();
        colorArray[i*3+1] = Math.random();
        colorArray[i*3+2] = Math.random();
      }

      geometry.addAttribute('translate', new THREE.InstancedBufferAttribute(translateArray, 3, 1));
      geometry.addAttribute('vector', new THREE.InstancedBufferAttribute(vectorArray, 3, 1));
      geometry.addAttribute('color', new THREE.InstancedBufferAttribute(colorArray, 3, 1));

      let material = new THREE.ShaderMaterial({
        uniforms: {
          time: {value: 0}
        },
        vertexShader: `
          attribute vec3 translate;
          attribute vec3 vector;
          attribute vec3 color;
          uniform float time;
          varying vec3 vColor;
          const float g = 9.8 * 1.5;
          void main() {
            vec3 offset;
            offset.xz = vector.xz * time;
            offset.y = vector.y * time - 0.5 * g * time * time;

            vec3 currentPosition = position + translate + offset;

            gl_Position = projectionMatrix * modelViewMatrix * vec4( currentPosition, 1.0 );
            vColor = color;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            gl_FragColor = vec4( vColor, 1.0 );
          }
        `
      });

      let mesh = new THREE.Mesh(geometry, material);

      this.model = mesh;
      this.el.setObject3D('mesh', mesh);
      this.el.emit('model-loaded', {format:'mesh', model: mesh});
    },

    tick: function(time, delta) {
      if (this.model === null) { return; }

      let mesh = this.model;
      mesh.material.uniforms.time.value = (mesh.material.uniforms.time.value + delta / 2000) % 5.0;
    }
  });
}
