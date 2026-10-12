import React from "react";
import { Link } from "react-router-dom";

export type Shade = { name: string; color: string };

export const SHADES: Shade[] = [
    { name: "Petal", color: "#f3c9cf" },
    { name: "Raspberry", color: "#c2185b" },
    { name: "Nude Silk", color: "#dcae96" },
    { name: "Berry Kiss", color: "#880e4f" },
    { name: "Peach Fuzz", color: "#f0a58f" },
    { name: "Mauve", color: "#a9728a" },
    { name: "Cocoa", color: "#7a4a3d" },
    { name: "Coral Pop", color: "#e8665d" },
    { name: "Wine", color: "#5e1f35" },
    { name: "Blush", color: "#eba9b8" },
    { name: "Terracotta", color: "#b8674e" },
    { name: "Plum", color: "#6b2d52" },
];

const Check = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-3 w-3" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="m5 12.5 4.5 4.5L19 7.5" />
    </svg>
);

interface AuthShadePanelProps {
    active: Shade;
    onActiveChange: (shade: Shade) => void;
    title: React.ReactNode;
    subtitle?: React.ReactNode;
    perks?: string[];
    layout?: "login" | "register";
}

export default function AuthShadePanel({
    active,
    onActiveChange,
    title,
    subtitle,
    perks,
    layout = "login",
}: AuthShadePanelProps): React.JSX.Element {
    return (
        <section
            className="relative hidden flex-col justify-between overflow-hidden p-12 transition-colors duration-500 lg:flex"
            style={{ backgroundColor: active.color }}
            aria-hidden="true"
        >
            <Link to="/" className="relative z-10 text-2xl font-bold tracking-[0.2em] text-white drop-shadow-sm">
                HAGORA
            </Link>

            <div className="relative z-10">
                {layout === "login" ? (
                    <>
                        <p className="text-sm font-medium text-white/80">Shade you're looking at</p>
                        <p
                            className="mt-1 text-6xl leading-none text-white drop-shadow-sm xl:text-7xl"
                            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                        >
                            {active.name}
                        </p>
                        <div className="mt-10 grid max-w-md grid-cols-6 gap-3">
                            {SHADES.map((shade) => (
                                <button
                                    key={shade.name}
                                    type="button"
                                    tabIndex={-1}
                                    onMouseEnter={() => onActiveChange(shade)}
                                    onClick={() => onActiveChange(shade)}
                                    className={`aspect-square rounded-full border-2 shadow-md transition hover:scale-110 ${active.name === shade.name ? "border-white scale-110" : "border-white/40"}`}
                                    style={{ backgroundColor: shade.color }}
                                    title={shade.name}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <p className="text-5xl leading-[1.05] text-white drop-shadow-sm xl:text-6xl" style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}>
                            {title}
                        </p>
                        {perks && (
                            <ul className="mt-8 space-y-3 text-[15px] text-white">
                                {perks.map((perk) => (
                                    <li key={perk} className="flex items-center gap-3">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/25">
                                            <Check />
                                        </span>
                                        {perk}
                                    </li>
                                ))}
                            </ul>
                        )}
                        {subtitle && <div className="mt-8 text-white">{subtitle}</div>}
                    </>
                )}
            </div>

            {layout === "login" ? (
                <p className="relative z-10 max-w-sm text-sm leading-6 text-white/90">
                    Sign in to see your saved shades, track your orders and check out faster.
                </p>
            ) : (
                <div className="relative z-10">
                    <p className="mb-3 text-sm font-medium text-white/85">Now showing: <span className="font-bold">{active.name}</span></p>
                    <div className="grid max-w-md grid-cols-6 gap-3">
                        {SHADES.map((shade) => (
                            <button
                                key={shade.name}
                                type="button"
                                tabIndex={-1}
                                onMouseEnter={() => onActiveChange(shade)}
                                onClick={() => onActiveChange(shade)}
                                className={`aspect-square rounded-full border-2 shadow-md transition hover:scale-110 ${active.name === shade.name ? "scale-110 border-white" : "border-white/40"}`}
                                style={{ backgroundColor: shade.color }}
                                title={shade.name}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
