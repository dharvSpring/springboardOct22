$(function() {
    // GIPHY is causing CORB errors because it is returning text/html not an image
/*
    const endPoint = 'http://api.giphy.com/v1/gifs/search';
    const apiKey = 'MhAodEJIJxQMxW9XqxKjyXfNYdLoOIym';
    
    async function getImages(searchText) {
        const response = await axios.get(endPoint, {params: {q: searchText, api_key: apiKey}});
        console.log(response);

        const {data, pagination} = response.data;

        if (pagination.count > 0) {
            const selected = Math.floor(Math.random() * pagination.count);
            console.log(selected);
            console.log(data[selected]);
            appendImage(data[selected]);
        }
    }

    function appendImage({embed_url, title}) {
        $('#images').append($(`<img src="${embed_url}.gif" title="${title}"></img>`));
    }
*/
    const tenorEP = 'https://tenor.googleapis.com/v2/search';
    const tenorKey = 'AIzaSyBpzZvNh63FmselUP3gGUbiPQrbdlZkdVI';

    async function getImagesTenor(searchText) {
        let response;
        try{
            response = await axios.get(tenorEP, {params: {q: searchText, key: tenorKey}});
            // console.log(response);
        } catch {error} {
            // console.log(error);
        }

        const results = response.data.results;

        if (results.length > 0) {
            const selected = Math.floor(Math.random() * results.length);
            console.log(selected);
            console.log(results[selected]);
            appendImageTenor(results[selected].media_formats);
        }
    }

    function appendImageTenor({gif}) {
        $('#images').append($(`<img src="${gif.url}" title="${'title'}"></img>`));
    }

    $('form').on('submit', (event) => {
        event.preventDefault();

        const searchText = $('form input[name="text"]').val();
        
        // GIPHY is causing CORB errors because it is returning text/html not an image
        // getImages(searchText);
        getImagesTenor(searchText);
        
        $('form input[name="text"]').val('');
        $('form input[name="text"]').focus();
    })

    $('form input[name="remove"]').on('click', (event) => {
        $('#images').html('');
    });
});