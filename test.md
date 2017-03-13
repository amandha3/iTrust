	 		Element head = report.createElement("PatientReport");
			report.appendChild(head);
			
			//assumed has document builder and factory
			for (int x = 0; x < Data.size(); x++)//for each top level element
			{
				// makes format <Patient name="blah" age="xx" birthdate=""/> etc...
				Element patient = report.createElement("Patient");
				for (int y = 0; ((y < Data.get(x).size()) && (y < headers.size())); y++)
				{
					patient.setAttribute(parse(headers.get(y)), parse(Data.get(x).get(y)));
				}
				head.appendChild(patient);
			}
