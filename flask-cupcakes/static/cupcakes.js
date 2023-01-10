
const API_PREFIX = '/api/cupcakes';
const $cupcakeList = $('#cupcakes');

function cupcakeLI(flavor) {
    return `<li>${flavor}</li>`
}

async function loadCupcakes() {
    const {data: {cupcakes}} = await axios.get(API_PREFIX);
    for (const cupcake of cupcakes) {
        $cupcakeList.append(cupcakeLI(cupcake.flavor));
    }
}

async function addCupcake() {
    const fields = $('input:not([type=hidden])');

    const newCupcake = {}
    for (const input of fields) {
        newCupcake[input.name] = input.value;
    }

    const {status, data:{cupcake}} = await axios.post(API_PREFIX, newCupcake);
    if (status == 201) {
        $cupcakeList.append(cupcakeLI(cupcake.flavor));
    }
}

$('#add-cupcake').click(addCupcake);
loadCupcakes();