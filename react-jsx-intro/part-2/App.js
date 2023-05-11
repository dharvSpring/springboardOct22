function App() {
    return (
        <div>
            <Tweet 
                username="david1"
                name="David"
                date={new Date().toDateString()}
                message="1st tweet!"
            />
            <Tweet 
                username="david2"
                name="DavidToo"
                date={new Date().toDateString()}
                message="2nd tweet!"
            />
            <Tweet 
                username="david1"
                name="David"
                date={new Date().toDateString()}
                message="Another Day Another Tweet!"
            />
        </div>
    );
}