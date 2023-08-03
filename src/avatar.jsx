const colors = ["red", "green", "blue", "yellow", "purple", "skyblue"];

import { renderToStaticMarkup } from "react-dom/server";

export const generateAvatar = (name) => {
    const avatarData = generateAvatarPrimitive(name);

    let avatar = (
        <svg width="200" height="200">
            <circle cx="100" cy="100" r="80" fill={avatarData.color} />
            <text x="100" y="115" textAnchor="middle" fill="white" alignmentBaseline="middle" fontSize="4em">{avatarData.initials}</text>
        </svg>
    );

    localStorage.setItem("avatar", renderToStaticMarkup(avatar));
};

const generateAvatarPrimitive = (name) => {
    const nameArray = name.split(" ");

    let initials = "";
    let color = 0;

    for (let i = 0; i < 2; i++) {
        initials += nameArray[i][0];
        color += nameArray[i].length;
    }

    return {
        initials,
        color: colors[color % 6]
    };
}