$(function() {
    $('form').on('submit', (event) => {
        event.preventDefault();

        const title = $('form input[name="title"]').val();
        const rating = $('form input[name="rating"]').val();
        
        if (title.length < 3) {
            alert('Movie Title must be more than 2 characters');
            return;
        }

        if (rating.length < 1 || rating < 0 || rating > 10) {
            alert('Rating must be between 0 and 10');
            return;
        }

        $('#movieList').append(`<span><span class="title">${title}</span> <span class="rating">${rating}</span><button>X</button><br/></span>`);
        
        $('form input[name="title"]').val('');
        $('form input[name="title"]').focus();
        $('form input[name="rating"]').val('');
    })

    $('#movieList').on('click', 'button', (event) => {
        $(event.target).parent().remove();
    })
});