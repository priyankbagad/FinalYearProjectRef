/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useState, useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom, tokenAtom } from "../../global/globalState";
import Axios from "axios";

const Appointment = () => {
	const [doctor, setDoctor] = useState(null);
	const [symptoms, setSymptoms] = useState(null);
	const [department, setDepartment] = useState(null);
	const [appointmentDate, setAppointmentDate] = useState(new Date());

	const [user, setUser] = useRecoilState(userAtom);
	const token = useRecoilValue(tokenAtom);
	const [prescription,setPrescription] = useState(null)
	const [docs, setDocs] = useState([
		{
			_id: "5435",
			name: "None",
		},
	]);

	useEffect(() => {
		Axios.get(`http://localhost:5000/doctor`)
			.then((res) => {
				setDocs(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	},[]);

	const handleAppointment = () => {
		Axios.post(
			`http://localhost:5000/appointment/book`,
			{
				symptoms,
				appointmentDate,
				department,
				doctor,
			},
			{
				headers: {
					Authorization: "Bearer " + token,
				},
			}
		)
			.then((res) => {
				console.log(res.data);
				setUser(res.data);
				localStorage.setItem("user", JSON.stringify(res.data));
			})
			.catch((err) => {
				console.error(err);
			});
	};

	useEffect(() => {
		Axios.get(`http://localhost:5000/prescription/get`, {
			headers: {
				Authorization: "Bearer " + token,
			},
		})
			.then((res) => {
				console.log(res.data);
				setPrescription(res.data.appointment)
				console.log(prescription)
				//setUser(res.data);
				//localStorage.setItem('user', JSON.stringify(res.data));
			})
			.catch((err) => {
				console.error(err);
			});
	}, []);

	return (
		
		<div className="Appointment">
			 <div className="container">
				<div>
					<h1>Book Appointment</h1>
					<p className="content">
						Patients can book online appointments with a specific
						doctor and can get prescription afterwards.
					</p>
				</div>
				<div className="main"> 
					<div className="appointment-submit">
						<h3>Submit your info</h3>
						<div className="appointment-form">
							<label htmlFor="symptoms">Symptoms</label>
							<input
								type="text"
								id="symptoms"
								value={symptoms}
								onChange={(e) => setSymptoms(e.target.value)}
							/>

							<label htmlFor="doctor">Doctor Name</label>
							<select
								name="blood_grp"
								value={doctor}
								onChange={(e) => setDoctor(e.target.value)}>
								{docs &&
									docs.map((doc) => (
										<option key={doc._id} value={doc.name}>
											{doc.name}
										</option>
									))}
							</select>

							<label htmlFor="department">Department</label>
							<input
								type="text"
								id="dept"
								value={department}
								onChange={(e) => setDepartment(e.target.value)}
							/>
							<label htmlFor="date">Appointment Date</label>
							<div className="date-pick">
								<input
									type="date"
									value={
										appointmentDate
											.getFullYear()
											.toString() +
										"-" +
										(appointmentDate.getMonth() + 1)
											.toString()
											.padStart(2, 0) +
										"-" +
										appointmentDate
											.getDate()
											.toString()
											.padStart(2, 0)
									}
									onChange={(e) =>
										setAppointmentDate(e.target.valueAsDate)
									}
								/>
							</div>
							<button
								className="primary"
								onClick={() => handleAppointment()}>
								Book
							</button>
						</div>
					</div>

					{prescription && (
						<div className="appointment-info">
							<h3>Your Appointment</h3>
							<div className="cards">
								{prescription && (
									<div className="card">
										<div className="image">
											<img
												src={require("../../assets/icons/medicine.png")}
												alt="Image"
											/>
										</div>

										<div className="content">
											<h4>
												Doctor :{" "}
												{prescription &&
													prescription.doctor}
											</h4>
											<p>
												Symptoms :{" "}
												{prescription &&
													prescription.symptoms}
											</p>
											<p>
												Date :{" "}
												{prescription &&
													prescription.appointmentDate &&
													prescription.appointmentDate.substring(
														0,
														10
												)}
											</p>
											<div className="prescription">
												<div className="pres">
													Prescription From Doctor
												</div>
												<p>
													{prescription &&
														prescription
														.prescription ? (
														<div className="pres-cont">
															<div>
																<strong>
																	Real
																	Symptoms
																</strong>{" "}
																:{" "}
																{
																	prescription
									
																		.symptoms
																}{" "}
															</div>
															<div>
																<strong>
																	Medicine
																</strong>{" "}
																:{" "}
																{
																	prescription.prescription.medicine
																}{" "}
															</div>
															<div>
																<strong>
																	Comments
																</strong>{" "}
																:{" "}
																{
																	prescription.prescription.comments
																}{" "}
															</div>
														</div>
													) : (
														<div>
															<p>
																<strong>
																	Take Care
																</strong>
															</p>
														</div>
													)}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Appointment;