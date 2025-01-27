import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { Link } from "react-router-dom";
import { SignUpInput } from "@siddharth_methiya1/medium-common";
export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const [postInputs, setPostInputs] = useState<SignUpInput>({
        name: "",
        email: "",
        password: "",
    });
    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="px-10">
                        <div className="text-2xl font-extrabold ">
                            Create an account
                        </div>
                        <div className="text-slate-400">
                            Already have an account?
                            <Link className="pl-1 underline" to={"/signin"}>
                                Login
                            </Link>
                        </div>
                    </div>
                    <div className="pt-10">
                        <LabelledInput
                            label="Name"
                            placeholder="Sid Methiya"
                            onChange={(e) => {
                                setPostInputs((c) => ({
                                    ...c,
                                    name: e.target.value,
                                }));
                            }}
                        />
                        <LabelledInput
                            label="Username"
                            placeholder="sid@gmail.com"
                            onChange={(e) => {
                                setPostInputs((c) => ({
                                    ...c,
                                    name: e.target.value,
                                }));
                            }}
                        />
                        <LabelledInput
                            label="Password"
                            placeholder=""
                            type={"password"}
                            onChange={(e) => {
                                setPostInputs((c) => ({
                                    ...c,
                                    name: e.target.value,
                                }));
                            }}
                        />
                        <button type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 
                            focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 
                            me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
                            {type === "signup" ? "Sign up" : "Sign in"}
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
};

interface LabelledInputTypes {
    label: string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type?: string;
}
function LabelledInput({
    label,
    placeholder,
    onChange,
    type,
}: LabelledInputTypes) {
    return (
        <div>
            <label className="block mb-2 text-sm text-black font-semibold pt-4">
                {label}
            </label>
            <input
                onChange={onChange}
                type={type || "text"}
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                placeholder={placeholder}
                required
            />
        </div>
    );
}
