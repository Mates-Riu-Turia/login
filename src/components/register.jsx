import { useState, useEffect } from "react";
import { Tabs, Tab, Alert, Form, FloatingLabel, Row, Col, Button, ListGroup } from "react-bootstrap";
import { LoginBackground } from "./loginBackground";
import { finishRegister, sendRegisterEmail, sendRegisterEmailTeacher, resendConfirmationEmail } from "../db";
import { EmailSended } from "./emailSended";
import { usePassword } from "../hooks/usePassword";

export function Register({ t }) {
    // Set the title of the page
    document.title = t("register.title");

    /* Possible component status
        - sendEmail -> Ask for the email and password (this data is sended with the registerUser() from MongoDB Realm)
                       the other data like name, is saved in the localStorage
        - emailSended -> The email was just sended, show a waiting screen
        - emailRecived -> If the tokens are correct, save the data from localStorage in the user's customData from 
                          MongoDB and then redirect to the login page
    */
    const [status, setStatus] = useState("sendEmail");

    // Read the URL
    const url = new URL(window.location.href);
    const token = url.searchParams.get("token");
    const tokenId = url.searchParams.get("tokenId");

    /* 
        * Check if the email is recived
        * We use useEffect for preventing an inifinite loop. If the condition is true
        * we change the status, and every time that we change the status, we re-render, i.e.: inifinite loop
    */
    useEffect(() => {
        if (token && tokenId) {
            setStatus("emailRecived");
        }
    }, [token, tokenId, setStatus]);

    // This state saves the email in case of resend
    const [confirmationEmail, setConfirmationEmail] = useState("");

    // Render the correct components
    switch (status) {
        case "sendEmail":
            return <SendEmail t={t} setStatus={setStatus} setConfirmationEmail={setConfirmationEmail} />;
        case "emailSended":
            return <EmailSended t={t} resend={() => resendConfirmationEmail(confirmationEmail)} />
        case "emailRecived":
            return <EmailRecived t={t} token={token} tokenId={tokenId} />;
        default:
            return <SendEmail t={t} setStatus={setStatus} setConfirmationEmail={setConfirmationEmail} />;
    };
}

// The SendEmail component and subcomponents

function SendEmail({ t, setStatus, setConfirmationEmail }) {
    return (
        <>
            <LoginBackground />
            <Tabs
                fill
                defaultActiveKey="student"
                className="mt-3 mb-3" style={{ maxWidth: "960px" }}
            >
                <Tab eventKey="student" title={t("register.student.student")}>
                    <RegisterStudent t={t} setStatus={setStatus} setConfirmationEmail={setConfirmationEmail} />
                </Tab>
                <Tab eventKey="profile" title={t("register.teacher.teacher")}>
                    <RegisterTeacher t={t} setStatus={setStatus} setConfirmationEmail={setConfirmationEmail} />
                </Tab>
            </Tabs>
        </>
    );
}

function RegisterStudent({ t, setStatus, setConfirmationEmail }) {
    // Show an error
    const [registerError, setRegisterError] = useState(false);

    // This states and functions are for showing or not the password in plain text
    const [passwordVisibility, changePasswordVisibility] = usePassword();
    const [passwordVisibility2, changePasswordVisibility2] = usePassword();

    // This state saves if the form was processed or not
    const [validated, setValidated] = useState(false);

    // This function validates the form
    const handleSubmit = async (event) => {
        // Don't let the browser do its own check
        event.preventDefault();
        // Remove previous errors
        setRegisterError(false);

        // Get form data
        const formRaw = new FormData(event.target);
        const form = Object.fromEntries(formRaw.entries());

        // Check if passwords match
        if (form.password != form.repassword) {
            form.repassword = "";
        }
        else {
            // Send the email and check for errors
            if (await sendRegisterEmail(form.email, form.password, form.name, form.surname, form.gender, form.course, form.classVal)) {
                setRegisterError(true);
            }
            else {
                setConfirmationEmail(form.email);
                setStatus("emailSended");
            }
        }

        setValidated(true);
    };

    return (
        <div style={{ maxWidth: "960px" }}>
            <RegisterError t={t} show={registerError} setShow={setRegisterError} />

            <h1 className="text-center">{t("register.student.title")}</h1>
            <Alert variant="info">
                <i className="bi bi-info-circle-fill"></i>
                {t("register.student.help")}
            </Alert>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <FloatingLabel
                            label={t("register.name")}
                            className="mb-3"
                        >
                            <Form.Control name="name" required type="text" placeholder="" />
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.name")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel
                            label={t("register.surname")}
                            className="mb-3"
                        >
                            <Form.Control name="surname" required type="text" placeholder="" />
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.surname")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            label={t("register.gender.gender")}
                            className="mb-3"
                        >
                            <Form.Select name="gender" className="mb-3">
                                <option value="M">{t("register.gender.man")}</option>
                                <option value="W">{t("register.gender.woman")}</option>
                                <option value="U">{t("register.gender.undefined")}</option>
                            </Form.Select>
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            label={t("register.course")}
                            className="mb-3"
                        >
                            <Form.Select name="course" className="mb-3">
                                <option value="1">{t("register.courses.1")}</option>
                                <option value="2">{t("register.courses.2")}</option>
                                <option value="3">{t("register.courses.3")}</option>
                                <option value="4">{t("register.courses.4")}</option>
                                <option value="5">{t("register.courses.5")}</option>
                                <option value="6">{t("register.courses.6")}</option>
                            </Form.Select>
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel
                            label={t("register.class")}
                            className="mb-3"
                        >
                            <Form.Select name="classVal" className="mb-3">
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </Form.Select>
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            label={t("email")}
                            className="mb-3"
                        >
                            <Form.Control name="email" required type="email" placeholder="" />
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.email")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <FloatingLabel label={t("password")} className="mb-3">
                        <Form.Control name="password" required type={passwordVisibility.status} placeholder="" />

                        <div className="position-relative">
                            <button className="password-toggle" type="button" onClick={changePasswordVisibility}>
                                <i className={passwordVisibility.icon}></i>
                            </button>
                        </div>

                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Row>
                <Row>
                    <FloatingLabel label={t("password")}>
                        <Form.Control name="repassword" required type={passwordVisibility2.status} placeholder="" />

                        <div className="position-relative">
                            <button className="password-toggle" type="button" onClick={changePasswordVisibility2}>
                                <i className={passwordVisibility2.icon}></i>
                            </button>
                        </div>

                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                    </FloatingLabel>

                </Row>

                <Row>
                    <Col>
                        <Button variant="primary" type="submit" className="mt-3 mb-5 w-100">{t("register.btn")}</Button>
                        <div className="mb-4"></div>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

function RegisterTeacher({ t, setStatus, setConfirmationEmail }) {
    // Show an error
    const [registerError, setRegisterError] = useState(false);

    // This states and functions are for showing or not the password in plain text
    const [passwordVisibility, changePasswordVisibility] = usePassword();
    const [passwordVisibility2, changePasswordVisibility2] = usePassword();
    const [passwordVisibility3, changePasswordVisibility3] = usePassword();

    // This state saves if the form was processed or not
    const [validated, setValidated] = useState(false);

    // This function validates the form
    const handleSubmit = async (event) => {
        // Don't let the browser do its own check
        event.preventDefault();
        // Remove previous errors
        setRegisterError(false);

        // Get form data
        const formRaw = new FormData(event.target);
        const form = Object.fromEntries(formRaw.entries());

        // Check if passwords match
        if (form.password != form.repassword) {
            form.repassword = "";
        }
        else {
            // Send the email and check for errors
            if (await sendRegisterEmailTeacher(form.secret, form.email, form.password, form.name, form.surname, form.gender, JSON.stringify(courses))) {
                setRegisterError(true);
            }
            else {
                setConfirmationEmail(form.email);
                setStatus("emailSended");
            }
        }

        setValidated(true);
    };

    const [courses, setCourses] = useState([]);

    return (
        <div style={{ maxWidth: "960px" }}>
            <RegisterError t={t} show={registerError} setShow={setRegisterError} />

            <h1 className="text-center">{t("register.teacher.title")}</h1>
            <Alert variant="info">
                <i className="bi bi-info-circle-fill"></i>
                {t("register.teacher.help")}
            </Alert>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Row>
                    <Col>
                        <FloatingLabel label={t("password")} className="mb-3">
                            <Form.Control name="secret" required type={passwordVisibility3.status} placeholder="" />

                            <div className="position-relative">
                                <button className="password-toggle" type="button" onClick={changePasswordVisibility3}>
                                    <i className={passwordVisibility3.icon}></i>
                                </button>
                            </div>

                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <FloatingLabel
                            label={t("register.name")}
                            className="mb-3"
                        >
                            <Form.Control name="name" required type="text" placeholder="" />
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.name")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                    <Col>
                        <FloatingLabel
                            label={t("register.surname")}
                            className="mb-3"
                        >
                            <Form.Control name="surname" required type="text" placeholder="" />
                            <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                            <Form.Control.Feedback type="invalid">{t("verify.surname")}</Form.Control.Feedback>
                        </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <CoursesList t={t} courses={courses} setCourses={setCourses} />
                </Row>
                <Row>
                    <FloatingLabel
                        label={t("register.gender.gender")}
                        className="mb-3"
                    >
                        <Form.Select name="gender" className="mb-3">
                            <option value="M">{t("register.gender.man")}</option>
                            <option value="W">{t("register.gender.woman")}</option>
                            <option value="U">{t("register.gender.undefined")}</option>
                        </Form.Select>
                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Row>
                <Row>
                    <FloatingLabel
                        label={t("email")}
                        className="mb-3"
                    >
                        <Form.Control name="email" required type="email" placeholder="" />
                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.email")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Row>
                <Row>
                    <FloatingLabel label={t("password")} className="mb-3">
                        <Form.Control name="password" required type={passwordVisibility.status} placeholder="" />

                        <div className="position-relative">
                            <button className="password-toggle" type="button" onClick={changePasswordVisibility}>
                                <i className={passwordVisibility.icon}></i>
                            </button>
                        </div>

                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Row>
                <Row>
                    <FloatingLabel label={t("password")}>
                        <Form.Control name="repassword" required type={passwordVisibility2.status} placeholder="" />

                        <div className="position-relative">
                            <button className="password-toggle" type="button" onClick={changePasswordVisibility2}>
                                <i className={passwordVisibility2.icon}></i>
                            </button>
                        </div>

                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid">{t("verify.password")}</Form.Control.Feedback>
                    </FloatingLabel>

                </Row>
                <Row>
                    <Col>
                        <Button variant="primary" type="submit" className="mt-3 mb-5 w-100">{t("register.btn")}</Button>
                        <div className="mb-4"></div>
                    </Col>
                </Row>
            </Form>
        </div>
    );
}

function CoursesList({ t, courses, setCourses }) {
    const addCourse = () => {
        const course = document.getElementById("course-course").value;
        const classVal = document.getElementById("class-course").value;
        const subject = document.getElementById("subject-course").value;

        setCourses([...courses, {
            course,
            class: classVal,
            subject
        }]);
    };

    const removeCourse = (id) => {
        let nextCourses = courses.map(course => course);

        nextCourses.splice(id - 1, 1)

        setCourses(
            nextCourses
        );
    };

    useEffect(() => { }, [courses]); // TRICK: We use this because setting the state is async and it may not update

    let courseId = 0;

    return (
        <>
            <Row>
                <ListGroup>
                    {
                        courses.map(course => {
                            courseId++;
                            return (
                                <ListGroup.Item key={courseId}>
                                    {t("register.subjects." + course.subject) + ", " + t("register.courses." + course.course) + " " + course.class}
                                    <div className="position-absolute top-50 start-100 translate-middle" onClick={() => removeCourse(courseId)}><i className="bi bi-trash"></i></div>
                                </ListGroup.Item>
                            );
                        }
                        )
                    }
                </ListGroup>
            </Row>
            <Row>
                <Col>
                    <FloatingLabel
                        controlId="course-course"
                        label={t("register.course")}
                        className="mb-3"
                    >
                        <Form.Select className="mb-3">
                            <option value="1">{t("register.courses.1")}</option>
                            <option value="2">{t("register.courses.2")}</option>
                            <option value="3">{t("register.courses.3")}</option>
                            <option value="4">{t("register.courses.4")}</option>
                            <option value="5">{t("register.courses.5")}</option>
                            <option value="6">{t("register.courses.6")}</option>
                        </Form.Select>
                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel
                        controlId="class-course"
                        label={t("register.class")}
                        className="mb-3"
                    >
                        <Form.Select className="mb-3">
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                        </Form.Select>
                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel
                        controlId="subject-course"
                        label={t("register.subjects.subjects")}
                        className="mb-3"
                    >
                        <Form.Select className="mb-3">
                            <option value='applied_anatomy'>{t('register.subjects.applied_anatomy')}</option>
                            <option value='english'>{t('register.subjects.english')}</option>
                            <option value='biology_geology'>{t('register.subjects.biology_geology')}</option>
                            <option value='spanish'>{t('register.subjects.spanish')}</option>
                            <option value='classic_culture'>{t('register.subjects.classic_culture')}</option>
                            <option value='technical_drawing'>{t('register.subjects.technical_drawing')}</option>
                            <option value='pe'>{t('register.subjects.pe')}</option>
                            <option value='philosophy'>{t('register.subjects.philosophy')}</option>
                            <option value='physics_chemistry'>{t('register.subjects.physics_chemistry')}</option>
                            <option value='french'>{t('register.subjects.french')}</option>
                            <option value='geography_history'>{t('register.subjects.geography_history')}</option>
                            <option value='greek'>{t('register.subjects.greek')}</option>
                            <option value='computer_science'>{t('register.subjects.computer_science')}</option>
                            <option value='universal_literature'>{t('register.subjects.universal_literature')}</option>
                            <option value='latin'>{t('register.subjects.latin')}</option>
                            <option value='maths'>{t('register.subjects.maths')}</option>
                            <option value='music'>{t('register.subjects.music')}</option>
                            <option value='guidance_tutoring'>{t('register.subjects.guidance_tutoring')}</option>
                            <option value='art'>{t('register.subjects.art')}</option>
                            <option value='religion'>{t('register.subjects.religion')}</option>
                            <option value='technology'>{t('register.subjects.technology')}</option>
                            <option value='valencia'>{t('register.subjects.valencian')}</option>
                            <option value='ethical_values'>{t('register.subjects.ethical_values')}</option>
                        </Form.Select>
                        <Form.Control.Feedback>{t("verify.ok")}</Form.Control.Feedback>
                    </FloatingLabel>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="success" className="w-100 mb-3" onClick={addCourse}>{t("register.subjects.add_course")}</Button>
                </Col>
            </Row>
        </>
    );
}

function EmailRecived({ t, token, tokenId }) {
    useEffect(() => {
        const finishRegisterSync = async (token, tokenId) => {
            if (!(await finishRegister(token, tokenId))) {
                window.location.href = "/login/";
            }
        };
        finishRegisterSync(token, tokenId);
    }, [token, tokenId]);

    return (
        <RegisterError t={t} show={true} setShow={() => { }} />
    );
}

function RegisterError({ t, show, setShow }) {
    if (show) {
        return (
            <Alert className="mt-2" variant="danger" onClose={() => setShow(false)} dismissible>
                {t("register.error")}
            </Alert>
        );
    }
}