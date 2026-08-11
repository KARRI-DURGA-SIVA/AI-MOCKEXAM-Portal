import { useEffect, useState } from "react";
import {
    FaUser,
    FaEnvelope,
    FaUniversity,
    FaCheck,
    FaExternalLinkAlt,
} from "react-icons/fa";

import {
    onAuthStateChanged,
    sendEmailVerification,
    type User,
} from "firebase/auth";

import {
    doc,
    getDoc,
    setDoc,
} from "firebase/firestore";

import { auth, db } from "../firebase";

import {
    getUniversitiesByCountry,
    type University,
} from "../services/universityApi";

import {
    getCountries,
    type Country,
} from "../services/countryApi";


function Profile() {

    /* =====================================================
       AUTHENTICATED USER
    ===================================================== */

    const [user, setUser] = useState<User | null>(null);


    /* =====================================================
       EDIT MODE
    ===================================================== */

    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);


    /* =====================================================
       SAVED PROFILE DATA
       These values are displayed in VIEW mode.
    ===================================================== */

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedCollege, setSelectedCollege] = useState("");
    const [manualCollege, setManualCollege] = useState("");

    const [degree, setDegree] = useState("");
    const [education, setEducation] = useState("");

    const [countryCode, setCountryCode] = useState("+91");
    const [phone, setPhone] = useState("");

    const [skills, setSkills] = useState("");

    const [linkedin, setLinkedin] = useState("");
    const [leetcode, setLeetcode] = useState("");
    const [portfolio, setPortfolio] = useState("");


    /* =====================================================
       EDIT / DRAFT DATA
       These values change while editing.
    ===================================================== */

    const [editFullName, setEditFullName] = useState("");
    const [editCountry, setEditCountry] = useState("");
    const [editCollege, setEditCollege] = useState("");
    const [editManualCollege, setEditManualCollege] = useState("");

    const [editDegree, setEditDegree] = useState("");
    const [editEducation, setEditEducation] = useState("");

    const [editCountryCode, setEditCountryCode] = useState("+91");
    const [editPhone, setEditPhone] = useState("");

    const [editSkills, setEditSkills] = useState("");

    const [editLinkedin, setEditLinkedin] = useState("");
    const [editLeetcode, setEditLeetcode] = useState("");
    const [editPortfolio, setEditPortfolio] = useState("");


    /* =====================================================
       COUNTRY / COLLEGE API
    ===================================================== */

    const [countries, setCountries] = useState<Country[]>([]);
    const [universities, setUniversities] = useState<University[]>([]);

    const [collegeSearch, setCollegeSearch] = useState("");

    const [loadingCountries, setLoadingCountries] = useState(false);
    const [loadingUniversities, setLoadingUniversities] = useState(false);

    const [editShowManualCollege, setEditShowManualCollege] =
        useState(false);


    /* =====================================================
       EMAIL VERIFICATION
    ===================================================== */

    const [emailVerified, setEmailVerified] = useState(false);
    const [verificationSending, setVerificationSending] =
        useState(false);


    /* =====================================================
       FIREBASE AUTH LISTENER
    ===================================================== */

    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {

                setUser(currentUser);

                if (!currentUser) {
                    return;
                }

                setFullName(
                    currentUser.displayName || ""
                );

                setEmail(
                    currentUser.email || ""
                );

                setEmailVerified(
                    currentUser.emailVerified
                );
            }
        );

        return () => unsubscribe();

    }, []);


    /* =====================================================
       LOAD COUNTRIES
    ===================================================== */

    useEffect(() => {

        const loadCountries = async () => {

            try {

                setLoadingCountries(true);

                const data = await getCountries();

                setCountries(data);

            } catch (error) {

                console.error(
                    "Failed to load countries:",
                    error
                );

            } finally {

                setLoadingCountries(false);

            }
        };

        loadCountries();

    }, []);


    /* =====================================================
       LOAD FIRESTORE PROFILE
    ===================================================== */

    useEffect(() => {

        if (!user) {
            return;
        }

        const loadProfile = async () => {

            try {

                const profileRef = doc(
                    db,
                    "users",
                    user.uid
                );

                const snapshot =
                    await getDoc(profileRef);

                if (!snapshot.exists()) {
                    return;
                }

                const data = snapshot.data();

                setFullName(
                    data.fullName ??
                    user.displayName ??
                    ""
                );

                setEmail(
                    user.email ??
                    ""
                );

                setSelectedCountry(
                    data.country ??
                    ""
                );

                setSelectedCollege(
                    data.college ??
                    ""
                );

                setManualCollege(
                    data.manualCollege ??
                    ""
                );

                setDegree(
                    data.degree ??
                    ""
                );

                setEducation(
                    data.education ??
                    ""
                );

                setCountryCode(
                    data.countryCode ??
                    "+91"
                );

                setPhone(
                    data.phone ??
                    ""
                );

                setSkills(
                    data.skills ??
                    ""
                );

                setLinkedin(
                    data.linkedin ??
                    ""
                );

                setLeetcode(
                    data.leetcode ??
                    ""
                );

                setPortfolio(
                    data.portfolio ??
                    ""
                );

            } catch (error) {

                console.error(
                    "Failed to load profile:",
                    error
                );

            }
        };

        loadProfile();

    }, [user]);


    /* =====================================================
       LOAD COLLEGES WHEN EDIT COUNTRY CHANGES
    ===================================================== */

    useEffect(() => {

        if (!isEditing || !editCountry) {

            setUniversities([]);

            return;

        }

        const loadUniversities = async () => {

            try {

                setLoadingUniversities(true);

                setUniversities([]);

                const data =
                    await getUniversitiesByCountry(
                        editCountry
                    );

                setUniversities(data);

            } catch (error) {

                console.error(
                    "Failed to load universities:",
                    error
                );

                setUniversities([]);

            } finally {

                setLoadingUniversities(false);

            }
        };

        loadUniversities();

    }, [editCountry, isEditing]);


    /* =====================================================
       USER ID
    ===================================================== */

    const userId = user?.uid
        ? `USR-${user.uid
            .slice(0, 8)
            .toUpperCase()}`
        : "USR-TEMP001";


    /* =====================================================
       CURRENT SAVED COLLEGE
    ===================================================== */

    const currentCollege =
        manualCollege ||
        selectedCollege ||
        "Not provided";


    /* =====================================================
       EDIT PROFILE
    ===================================================== */

    const handleEditProfile = () => {

        /*
         * Copy saved values into draft values.
         * Nothing is changed in the actual profile.
         */

        setEditFullName(fullName);

        setEditCountry(selectedCountry);

        setEditCollege(selectedCollege);

        setEditManualCollege(manualCollege);

        setEditDegree(degree);

        setEditEducation(education);

        setEditCountryCode(countryCode);

        setEditPhone(phone);

        setEditSkills(skills);

        setEditLinkedin(linkedin);

        setEditLeetcode(leetcode);

        setEditPortfolio(portfolio);

        setEditShowManualCollege(
            Boolean(manualCollege)
        );

        setCollegeSearch("");

        setIsEditing(true);
    };


    /* =====================================================
       UPDATE PROFILE
    ===================================================== */

    const handleUpdateProfile = async () => {

        if (!user) {

            alert(
                "No authenticated user found."
            );

            return;
        }

        try {

            setSaving(true);

            const profileRef = doc(
                db,
                "users",
                user.uid
            );


            await setDoc(
                profileRef,
                {
                    uid: user.uid,

                    fullName:
                        editFullName.trim(),

                    email:
                        user.email ||
                        email,

                    country:
                        editCountry,

                    college:
                        editCollege,

                    manualCollege:
                        editManualCollege.trim(),

                    degree:
                        editDegree,

                    education:
                        editEducation,

                    countryCode:
                        editCountryCode,

                    phone:
                        editPhone.trim(),

                    skills:
                        editSkills.trim(),

                    linkedin:
                        editLinkedin.trim(),

                    leetcode:
                        editLeetcode.trim(),

                    portfolio:
                        editPortfolio.trim(),

                    showManualCollege:
                        editShowManualCollege,

                    updatedAt:
                        new Date(),
                },
                {
                    merge: true,
                }
            );


            /*
             * ONLY NOW update the saved state.
             */

            setFullName(
                editFullName.trim()
            );

            setSelectedCountry(
                editCountry
            );

            setSelectedCollege(
                editCollege
            );

            setManualCollege(
                editManualCollege.trim()
            );

            setDegree(
                editDegree
            );

            setEducation(
                editEducation
            );

            setCountryCode(
                editCountryCode
            );

            setPhone(
                editPhone.trim()
            );

            setSkills(
                editSkills.trim()
            );

            setLinkedin(
                editLinkedin.trim()
            );

            setLeetcode(
                editLeetcode.trim()
            );

            setPortfolio(
                editPortfolio.trim()
            );

            setIsEditing(false);

            alert(
                "Profile updated successfully."
            );

        } catch (error) {

            console.error(
                "Failed to update profile:",
                error
            );

            alert(
                "Unable to update profile. Please try again."
            );

        } finally {

            setSaving(false);

        }
    };


    /* =====================================================
       EMAIL VERIFICATION
    ===================================================== */

    const handleVerifyEmail = async () => {

        if (!user) {

            alert(
                "No authenticated user found."
            );

            return;
        }

        try {

            setVerificationSending(true);

            await sendEmailVerification(user);

            alert(
                "Verification email sent. Please check your inbox."
            );

        } catch (error) {

            console.error(
                "Email verification error:",
                error
            );

            alert(
                "Unable to send verification email."
            );

        } finally {

            setVerificationSending(false);

        }
    };


    /* =====================================================
       CHECK EMAIL VERIFICATION
    ===================================================== */

    const checkEmailVerification = async () => {

        if (!user) {
            return;
        }

        try {

            await user.reload();

            setEmailVerified(
                user.emailVerified
            );

        } catch (error) {

            console.error(
                "Unable to refresh verification status:",
                error
            );

        }
    };


    /* =====================================================
       FILTER COLLEGES
    ===================================================== */

    const filteredUniversities =
        universities.filter(
            (university) =>
                university.name
                    .toLowerCase()
                    .includes(
                        collegeSearch.toLowerCase()
                    )
        );


    return (

        <div className="min-h-full p-8">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-8">

                <h1 className="text-3xl font-semibold text-gray-800">
                    Profile
                </h1>

                <p className="mt-2 text-gray-500">
                    Manage your account and personal information
                </p>

            </div>


            {/* =================================================
                PROFILE + PERSONAL INFORMATION
            ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">


                {/* =================================================
                    PROFILE CARD
                ================================================= */}

                <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center">

                    <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center">

                        <FaUser className="text-blue-600 text-5xl" />

                    </div>


                    <h2 className="mt-5 text-2xl font-semibold text-gray-800">

                        {fullName || "User"}

                    </h2>


                    <p className="mt-1 text-gray-500">
                        Student
                    </p>


                    {/* =========================================
                        EDIT / UPDATE BUTTON
                    ========================================= */}

                    <button
                        type="button"
                        onClick={
                            isEditing
                                ? handleUpdateProfile
                                : handleEditProfile
                        }
                        disabled={saving}
                        className="mt-6 px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                    >

                        {isEditing
                            ? saving
                                ? "Updating..."
                                : "Update Profile"
                            : "Edit Profile"}

                    </button>

                </div>


                {/* =================================================
                    PERSONAL INFORMATION
                ================================================= */}

                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8">

                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Personal Information
                    </h2>


                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">


                        {/* Full Name */}

                        <div>

                            <label className="text-sm text-gray-500">
                                Full Name
                            </label>

                            <div className="flex items-center gap-3 mt-3">

                                <FaUser className="text-blue-600 shrink-0" />

                                <p className="text-gray-800">
                                    {fullName || "Not provided"}
                                </p>

                            </div>

                        </div>


                        {/* Email */}

                        <div>

                            <label className="text-sm text-gray-500">
                                Email
                            </label>

                            <div className="flex items-center gap-3 mt-3">

                                <FaEnvelope className="text-blue-600 shrink-0" />

                                <p className="text-gray-800 break-all">
                                    {email || "No email available"}
                                </p>

                            </div>

                        </div>


                        {/* User ID */}

                        <div>

                            <label className="text-sm text-gray-500">
                                User ID
                            </label>

                            <div className="flex items-center gap-3 mt-3">

                                <FaUser className="text-blue-600 shrink-0" />

                                <p className="text-gray-800 break-all">
                                    {userId}
                                </p>

                            </div>

                        </div>


                        {/* College */}

                        <div>

                            <label className="text-sm text-gray-500">
                                College Name
                            </label>

                            <div className="flex items-center gap-3 mt-3">

                                <FaUniversity className="text-blue-600 shrink-0" />

                                <p className="text-gray-800">
                                    {currentCollege}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                ADDITIONAL INFORMATION
            ================================================= */}

            <div className="mt-6 bg-white rounded-xl shadow-sm p-8">

                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Additional Information
                </h2>


                {isEditing ? (

                    /* =================================================
                       EDIT MODE
                    ================================================= */

                    <div className="space-y-6">


                        {/* Full Name */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                value={editFullName}
                                onChange={(event) =>
                                    setEditFullName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter your full name"
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                            />

                        </div>


                        {/* Email */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-2">
                                Email
                            </label>

                            <div className="flex gap-3">

                                <input
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 bg-gray-50"
                                />


                                {emailVerified ? (

                                    <button
                                        type="button"
                                        onClick={
                                            checkEmailVerification
                                        }
                                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-green-50 text-green-600 border border-green-200"
                                    >

                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-white">

                                            <FaCheck size={10} />

                                        </span>

                                        Verified

                                    </button>

                                ) : (

                                    <button
                                        type="button"
                                        onClick={
                                            handleVerifyEmail
                                        }
                                        disabled={
                                            verificationSending
                                        }
                                        className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
                                    >

                                        {verificationSending
                                            ? "Sending..."
                                            : "Verify"}

                                    </button>

                                )}

                            </div>


                            {!emailVerified && (

                                <button
                                    type="button"
                                    onClick={
                                        checkEmailVerification
                                    }
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-700"
                                >

                                    Already verified? Check status

                                </button>

                            )}

                        </div>


                        {/* Country */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-2">
                                Country
                            </label>


                            <select
                                value={editCountry}
                                onChange={(event) => {

                                    const country =
                                        event.target.value;

                                    setEditCountry(
                                        country
                                    );

                                    /*
                                     * Reset college draft
                                     * because country changed.
                                     */

                                    setEditCollege("");

                                    setEditManualCollege("");

                                    setCollegeSearch("");

                                    setEditShowManualCollege(
                                        false
                                    );

                                }}
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600"
                            >

                                <option value="">

                                    {loadingCountries
                                        ? "Loading countries..."
                                        : "Select country"}

                                </option>


                                {countries.map(
                                    (country) => (

                                        <option
                                            key={
                                                country.cca2
                                            }
                                            value={
                                                country.name.common
                                            }
                                        >

                                            {
                                                country.name.common
                                            }

                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        {/* =================================================
                            COLLEGE / UNIVERSITY
                        ================================================= */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-2">
                                College / University
                            </label>


                            {!editCountry ? (

                                <div className="border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-400">
                                    Select a country first to find your college
                                </div>

                            ) : editShowManualCollege ? (

                                /* ==============================
                                   MANUAL COLLEGE
                                ============================== */

                                <div className="space-y-3">

                                    <input
                                        type="text"
                                        value={
                                            editManualCollege
                                        }
                                        onChange={(event) =>
                                            setEditManualCollege(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Enter your college / university name"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setEditShowManualCollege(
                                                false
                                            );

                                            setEditManualCollege(
                                                ""
                                            );

                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >

                                        ← Select from college list

                                    </button>

                                </div>

                            ) : (

                                /* ==============================
                                   COLLEGE API SEARCH + SELECT
                                ============================== */

                                <div className="space-y-3">

                                    <input
                                        type="text"
                                        value={
                                            collegeSearch
                                        }
                                        onChange={(event) => {

                                            setCollegeSearch(event.target.value);

                                            setEditCollege("");

                                        }}
                                        placeholder="Search college or university"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                    />


                                    <select
                                        value={
                                            editCollege
                                        }
                                        onChange={(
                                            event
                                        ) => {

                                            const value =
                                                event
                                                    .target
                                                    .value;

                                            if (
                                                value ===
                                                "__NOT_LISTED__"
                                            ) {

                                                setEditShowManualCollege(
                                                    true
                                                );

                                                setEditCollege(
                                                    ""
                                                );

                                                return;
                                            }

                                            setEditCollege(
                                                value
                                            );

                                        }}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600"
                                    >

                                        <option value="">

                                            {loadingUniversities
                                                ? "Loading colleges..."
                                                : universities.length ===
                                                    0
                                                    ? "No colleges found"
                                                    : "Select college / university"}

                                        </option>


                                        {filteredUniversities.map(
                                            (
                                                university,
                                                index
                                            ) => (

                                                <option
                                                    key={`${university.name}-${university.alpha_two_code}-${index}`}
                                                    value={
                                                        university.name
                                                    }
                                                >

                                                    {
                                                        university.name
                                                    }

                                                </option>

                                            )
                                        )}


                                        <option value="__NOT_LISTED__">

                                            My college is not listed

                                        </option>

                                    </select>


                                    {/* API result information */}

                                    {!loadingUniversities &&
                                        editCountry &&
                                        universities.length >
                                        0 && (

                                            <p className="text-xs text-gray-400">

                                                {filteredUniversities.length}
                                                {" "}
                                                college
                                                {filteredUniversities.length !==
                                                    1
                                                    ? "s"
                                                    : ""
                                                }
                                                {" "}
                                                found

                                            </p>

                                        )}


                                    {!loadingUniversities &&
                                        editCountry &&
                                        universities.length ===
                                        0 && (

                                            <p className="text-sm text-gray-500">

                                                No colleges were returned
                                                for this country.

                                            </p>

                                        )}

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            EDUCATION + PHONE
                        ================================================= */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                            {/* Education */}

                            <div>

                                <label className="block text-sm text-gray-500 mb-2">
                                    Education
                                </label>

                                <div className="grid grid-cols-2 gap-3">

                                    <select
                                        value={
                                            editDegree
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditDegree(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600"
                                    >

                                        <option value="">
                                            Degree
                                        </option>

                                        <option value="B.Tech / B.E">
                                            B.Tech / B.E
                                        </option>

                                        <option value="B.Sc">
                                            B.Sc
                                        </option>

                                        <option value="BCA">
                                            BCA
                                        </option>

                                        <option value="M.Tech / M.E">
                                            M.Tech / M.E
                                        </option>

                                        <option value="M.Sc">
                                            M.Sc
                                        </option>

                                        <option value="MCA">
                                            MCA
                                        </option>

                                        <option value="MBA">
                                            MBA
                                        </option>

                                        <option value="PhD">
                                            PhD
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>

                                    </select>


                                    <select
                                        value={editEducation}
                                        onChange={(event) =>
                                            setEditEducation(event.target.value)
                                        }
                                        className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600"
                                    >
                                        <option value="">
                                            Branch / Field
                                        </option>

                                        <option value="Computer Science and Engineering">
                                            Computer Science and Engineering
                                        </option>

                                        <option value="Information Technology">
                                            Information Technology
                                        </option>

                                        <option value="Electronics and Communication Engineering">
                                            Electronics and Communication Engineering
                                        </option>

                                        <option value="Electrical and Electronics Engineering">
                                            Electrical and Electronics Engineering
                                        </option>

                                        <option value="Mechanical Engineering">
                                            Mechanical Engineering
                                        </option>

                                        <option value="Civil Engineering">
                                            Civil Engineering
                                        </option>

                                        <option value="Artificial Intelligence and Machine Learning">
                                            Artificial Intelligence and Machine Learning
                                        </option>

                                        <option value="Artificial Intelligence and Data Science">
                                            Artificial Intelligence and Data Science
                                        </option>

                                        <option value="Data Science">
                                            Data Science
                                        </option>

                                        <option value="Cyber Security">
                                            Cyber Security
                                        </option>

                                        <option value="Other">
                                            Other
                                        </option>
                                    </select>

                                </div>

                            </div>


                            {/* Phone */}

                            <div>

                                <label className="block text-sm text-gray-500 mb-2">
                                    Phone Number
                                </label>

                                <div className="flex">

                                    <select
                                        value={
                                            editCountryCode
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditCountryCode(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        className="w-28 border border-gray-300 rounded-l-lg px-2 py-2.5 outline-none focus:border-blue-600"
                                    >

                                        <option value="+91">
                                            +91
                                        </option>

                                        <option value="+1">
                                            +1
                                        </option>

                                        <option value="+44">
                                            +44
                                        </option>

                                        <option value="+61">
                                            +61
                                        </option>

                                        <option value="+81">
                                            +81
                                        </option>

                                        <option value="+49">
                                            +49
                                        </option>

                                        <option value="+33">
                                            +33
                                        </option>

                                    </select>


                                    <input
                                        type="tel"
                                        value={
                                            editPhone
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setEditPhone(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        placeholder="Phone number"
                                        className="flex-1 border border-gray-300 border-l-0 rounded-r-lg px-4 py-2.5 outline-none focus:border-blue-600"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Skills */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-2">
                                Skills
                            </label>

                            <input
                                type="text"
                                value={
                                    editSkills
                                }
                                onChange={(event) =>
                                    setEditSkills(
                                        event.target.value
                                    )
                                }
                                placeholder="Java, React, SQL, Spring Boot..."
                                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600"
                            />

                            <p className="text-xs text-gray-400 mt-1">
                                Separate skills using commas.
                            </p>

                        </div>


                        {/* Social Links */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-3">
                                Social Media Links
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                <input
                                    type="url"
                                    value={
                                        editLinkedin
                                    }
                                    onChange={(event) =>
                                        setEditLinkedin(
                                            event.target.value
                                        )
                                    }
                                    placeholder="LinkedIn URL"
                                    className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600"
                                />

                                <input
                                    type="url"
                                    value={
                                        editLeetcode
                                    }
                                    onChange={(event) =>
                                        setEditLeetcode(
                                            event.target.value
                                        )
                                    }
                                    placeholder="LeetCode URL"
                                    className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600"
                                />

                                <input
                                    type="url"
                                    value={
                                        editPortfolio
                                    }
                                    onChange={(event) =>
                                        setEditPortfolio(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Portfolio URL"
                                    className="border border-gray-300 rounded-lg px-4 py-2.5 outline-none focus:border-blue-600"
                                />

                            </div>

                        </div>


                        {/* =================================================
                            BOTTOM UPDATE BUTTON
                        ================================================= */}

                        <div className="flex justify-end pt-4">

                            <button
                                type="button"
                                onClick={
                                    handleUpdateProfile
                                }
                                disabled={saving}
                                className="px-7 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
                            >

                                {saving
                                    ? "Updating..."
                                    : "Update Profile"}

                            </button>

                        </div>

                    </div>

                ) : (

                    /* =================================================
                       VIEW MODE
                    ================================================= */

                    <div className="space-y-8">


                        {/* Education + Phone */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            <div>

                                <label className="block text-sm text-gray-500 mb-2">
                                    Education
                                </label>

                                <p className="text-gray-800">

                                    {degree || education
                                        ? `${degree}${degree && education
                                            ? " - "
                                            : ""
                                        }${education}`
                                        : "Not provided"}

                                </p>

                            </div>


                            <div>

                                <label className="block text-sm text-gray-500 mb-2">
                                    Phone Number
                                </label>

                                <p className="text-gray-800">

                                    {phone
                                        ? `${countryCode} ${phone}`
                                        : "Not provided"}

                                </p>

                            </div>

                        </div>


                        {/* Skills */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-2">
                                Skills
                            </label>

                            <p className="text-gray-800">
                                {skills || "Not provided"}
                            </p>

                        </div>


                        {/* Social Links */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-3">
                                Social Media Links
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                                <div>

                                    <p className="text-xs text-gray-500 mb-2">
                                        LinkedIn
                                    </p>

                                    {linkedin ? (

                                        <a
                                            href={linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 break-all"
                                        >

                                            <span>
                                                {linkedin}
                                            </span>

                                            <FaExternalLinkAlt
                                                size={12}
                                                className="shrink-0"
                                            />

                                        </a>

                                    ) : (

                                        <p className="text-gray-800">
                                            Not provided
                                        </p>

                                    )}

                                </div>


                                <div>

                                    <p className="text-xs text-gray-500 mb-2">
                                        LeetCode
                                    </p>

                                    {leetcode ? (

                                        <a
                                            href={leetcode}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 break-all"
                                        >

                                            <span>
                                                {leetcode}
                                            </span>

                                            <FaExternalLinkAlt
                                                size={12}
                                                className="shrink-0"
                                            />

                                        </a>

                                    ) : (

                                        <p className="text-gray-800">
                                            Not provided
                                        </p>

                                    )}

                                </div>


                                <div>

                                    <p className="text-xs text-gray-500 mb-2">
                                        Portfolio
                                    </p>

                                    {portfolio ? (

                                        <a
                                            href={portfolio}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 break-all"
                                        >

                                            <span>
                                                {portfolio}
                                            </span>

                                            <FaExternalLinkAlt
                                                size={12}
                                                className="shrink-0"
                                            />

                                        </a>

                                    ) : (

                                        <p className="text-gray-800">
                                            Not provided
                                        </p>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* College */}

                        <div>

                            <label className="block text-sm text-gray-500 mb-2">
                                College / University
                            </label>

                            <div className="flex items-center gap-3">

                                <FaUniversity className="text-blue-600 shrink-0" />

                                <p className="text-gray-800">
                                    {currentCollege}
                                </p>

                            </div>

                        </div>

                    </div>

                )}

            </div>

        </div>
    );
}

export default Profile;