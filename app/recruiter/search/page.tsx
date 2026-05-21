"use client";

import { useState, useEffect } from "react";
import "@/styles/recruiter/CreateJob.css";
import {
  getProvinces,
  getWardsByProvince,
  Province,
  Ward
} from "@/services/locations/LocationService";
import JobTaggingPage from "../jobs/create/JobTaggingPage";
import StepBasic from "@/components/recruiter/StepGeneralInformation";
import StepDetail from "@/components/recruiter/StepDetail";

export default function CreateJobPage() {
return <StepBasic />
  
}