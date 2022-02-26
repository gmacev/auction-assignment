import React from 'react';
import {Link} from "react-router-dom";

const InListBidComp = ({getAuction, getBids}) => {
    function getBidTime(dateTime){
        const d = new Date(dateTime)

        return d.toLocaleString()
    }

    return (
        <div className="d-flex flex-column gap-3 mt-4">
            {!getAuction && <h2 className="text-center mb-4">My bids</h2>}
            {getAuction && getAuction.bids ?
                getAuction.bids.length > 0 ? getAuction.bids.map((bid, index) => {
                    return <div className="boxBid d-flex w-100 justify-content-between" key={index}>
                        <p><b>Placed by:</b> {bid.username}</p>
                        <p><b>Price:</b> {bid.price}€</p>
                        <p><b>Placed on:</b> {getBidTime(bid.bidTime)}</p>
                    </div>
                })
                :
                <p className="text-center m-0 mt-4">No bids have been made yet. Be the first!</p>
                :
                getBids && getBids.length > 0 ? getBids.map((bid, index) => {
                        return <div className="boxBid d-flex w-100 gap-5 justify-content-between bg-white" key={index}>
                            <p><b>Price:</b> {bid.bid.price}€</p>
                            <p><b>Placed on:</b> {getBidTime(bid.bid.bidTime)}</p>
                            <Link to={`/auction/${bid.auction}`}>Go to the auction</Link>
                        </div>
                })
                :
                <p className="text-center m-0 mt-4">You haven't made any bids yet.</p>
            }
        </div>
    );
};

export default InListBidComp;