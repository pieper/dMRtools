
function buildScene(id) {

  const viewer = document.getElementById(id);
  viewer.innerHTML = `
      <a-scene embedded>
        <a-entity id="camera" camera="fov: 80; zoom: 1;" position="0 0 2"
            orbit-controls=" autoRotate: false; target: #target; enableDamping: true; dampingFactor: 0.125; rotateSpeed:0.25; minDistance:1; maxDistance:100; " >
        </a-entity>

        <a-entity id="target">
          <a-entity id="tracts" position="0 0 .25" scale="15 15 15" rotation="-90 180 0">

            <a-gltf-model id='CST' src="https://s3.amazonaws.com/IsomicsPublic/SampleData/gltf/tracts-small/CST.gltf"></a-gltf-model>
            <a-gltf-model id='UF' src="https://s3.amazonaws.com/IsomicsPublic/SampleData/gltf/tracts-small/UF.gltf"></a-gltf-model>

          </a-entity>
        </a-entity>
        <a-sky color="#ECECEC"></a-sky>
      </a-scene>
    `;
}
