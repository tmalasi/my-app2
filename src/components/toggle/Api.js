import { useState } from "react";
import { ToggleButton } from '@mui/material';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Github from "../github/Github";
import Library from "../library/Library";
import "./Api.css"

const Api = () => {
    const [toggleval, setToggleval] = useState('library');

    const handleAlignment = (event, newAlignment) => {
        if (newAlignment !== null) {
            console.log(event);
            setToggleval(newAlignment);
        }
    };

    return (
        <div>
            <ToggleButtonGroup
                value={toggleval}
                exclusive
                onChange={handleAlignment}
            >
                <ToggleButton value="git" aria-label="GitHub">
                    GitHub
                </ToggleButton>
                <ToggleButton value="library" aria-label="Library">
                    Library
                </ToggleButton>
            </ToggleButtonGroup>

            {toggleval === 'git' && <Github />}
            {toggleval === 'library' && <Library />}
        </div>
    );
};

export default Api;
