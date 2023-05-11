function Person({name, age, hobbies}) {
    return (
        <div>
            <p>Learn some information about this person</p>
            <ul>
                <li>Name: {name.length > 8 ? name.slice(0, 6) : name}</li>
                <li>Age: {age}</li>
                <li><h3>{age < 18 ? "you must be 18" : "please go vote!"}</h3></li>
                <li>Hobbies:
                    <ul>
                        {hobbies.map(h => <li>{h}</li>)}
                    </ul>
                </li>
            </ul>
        </div>
    )
}