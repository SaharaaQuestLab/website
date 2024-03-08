import React, { useEffect } from 'react';
import ReactGA from "react-ga4";

export default function TrackPageView () {

    useEffect(() => {
        ReactGA.initialize("G-8JY051HV2D");
    }, []);

    return <></>;
}
