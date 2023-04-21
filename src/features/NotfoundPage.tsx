import { Link } from 'react-router-dom';
import * as React from "react";

export default function NotfoundPage() {
    return (
        <div>
            This page doesn't exist. Go <Link to="/Login">Login</Link>
        </div>
    );
}