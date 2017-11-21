// addCenter.js

const getCenter = (a, b, c) => {
	return [
		(a[0] + b[0] + c[0]) / 3,
		(a[1] + b[1] + c[1]) / 3,
		(a[2] + b[2] + c[2]) / 3
	]
}

const addCenter = (mesh) => {
	const { vertices } = mesh;
	const centers = [];

	let a, b, c;
	for(let i=0; i<vertices.length; i+= 3) {
		a = vertices[i];
		b = vertices[i+1];
		c = vertices[i+2];

		const center = getCenter(a, b, c);
		centers.push(center);
		centers.push(center);
		centers.push(center);
	}

	mesh.bufferData(centers, 'aCenter');

}

export default addCenter;