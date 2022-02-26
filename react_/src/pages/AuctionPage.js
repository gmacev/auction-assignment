import React, {useEffect} from 'react';
import SingleAuctionComp from "../components/SingleAuctionComp";
import {useParams} from "react-router-dom";
import axios from "axios";

const AuctionPage = () => {
    const {auctionId} = useParams()

    return (
        <>
            <SingleAuctionComp auctionId={auctionId}/>
        </>
    );
};

export default AuctionPage;