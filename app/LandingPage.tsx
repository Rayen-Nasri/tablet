"use client";
import dynamic from 'next/dynamic';
import { LoadingScreen } from './LoadingScreen';

const Ipad = dynamic(() => import('./Ipad').then(mod => mod.Ipad), {
    ssr: true,
});

export const LandingPage = () => {
    return (
        <LoadingScreen>
            <Ipad />
        </LoadingScreen>
    );
};