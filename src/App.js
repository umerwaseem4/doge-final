import "./App.css";
import React, { useState, useEffect } from "react";
import Amplify, { API, graphqlOperation } from "aws-amplify";
import { updateDoge } from "./graphql/mutations";
import { getDoge } from "./graphql/queries";
import awsExports from "./aws-exports";

Amplify.configure(awsExports);

function App() {
    const [dogePrice, setDogePrice] = useState(0);
    async function fetchDogePrice() {
        try {
            const dogeData = await API.graphql(graphqlOperation(getDoge));
            const dogePrice = dogeData.data.getDoge.price;
            setDogePrice(dogePrice);
        } catch (err) {
            console.log(`Error fetching doge price`);
            console.log(err);
        }
    }

    async function updateDogePrice() {
        try {
            const dogeData = await API.graphql(graphqlOperation(getDoge));
            const dogePrice = (dogeData.getDoge.price += 0.1);
            const updatedDogePrice = await API.graphql(
                graphqlOperation(updateDoge, { input: dogePrice })
            );
            setDogePrice(updatedDogePrice.data.updateDoge.price);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchDogePrice();
    }, []);

    return (
        <div className="App">
            <div className="App-header">
                <h1>Doge coin price predictor</h1>
                <p>On click equal = 10 cents</p>
                <h2>{dogePrice}</h2>
                <button onClick={updateDogePrice}>Doge</button>
            </div>
        </div>
    );
}

export default App;
