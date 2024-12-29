import { useAuth } from "../context/AuthContext";
import { calculateCurrentCaffeineLevel, coffeeConsumptionHistory, getCaffeineAmount, timeSinceConsumption } from "../utils";

export default function History() {
    const { globalData } = useAuth()

    return (
        <>
            <div className="section-header">
                <i className="fa-solid fa-timeline"></i>
                <h2>History</h2>
            </div>  
            <p><i>Hover for more information!</i></p>
            <div className="coffee-history">
                {Object.keys(globalData).sort((a, b) => b - a).map((utcTime, coffeeIndex) => {
                    const coffee = globalData[utcTime]
                    const timeSinceConsumed = timeSinceConsumption(utcTime)
                    const origAmt = getCaffeineAmount(coffee.name)
                    const remainingAmt = calculateCurrentCaffeineLevel({
                        [utcTime]: coffee
                    })

                    const summary = `${coffee.name} | ${timeSinceConsumed} | $${coffee.cost} | ${remainingAmt}mg / ${origAmt}mg`

                    return (
                        <div title={summary} key={coffeeIndex}>
                            <i className="fa-solid fa-mug-hot"></i>
                        </div>
                    )
                })}
            </div>
        </>
    )
}