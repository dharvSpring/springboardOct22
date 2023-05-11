function Tweet({username, name, date, message}) {
    return (
        <div className="tweet">
            <p>{name} <i>@{username}</i></p>
            <p>{date}</p>
            <p>{message}</p>
        </div>
    )
}