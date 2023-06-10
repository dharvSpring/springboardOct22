const DEFAULT_MEMES = { memes: [] };

function memeReducer(state = DEFAULT_MEMES, action) {
    switch (action.type) {
        case 'ADD':
            return { ...state, memes: [action.payload, ...state.memes] }
        case 'REMOVE':
            return {
                ...state, memes: state.memes.filter(meme => {
                    return meme.id != action.payload
                    // return (action.payload.topText != meme.topText
                    //     || action.payload.bottomText != meme.bottomText
                    //     || action.payload.imgSrc != meme.imgSrc)
                })
            }
        case 'RESET':
            return DEFAULT_MEMES;
        default:
            return state;
    }
}