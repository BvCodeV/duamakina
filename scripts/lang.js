(function () {
  if (window.DuaI18n?.ready) {
    window.DuaI18n.init?.();
    return;
  }

  const SUPPORTED_LANGS = ["en", "sq", "fr", "it", "de"];
  const DEFAULT_LANG = "en";

  const phraseMap = {
    sq: {
      "English": "Anglisht",
      "Albanian": "Shqip",
      "French": "Frengjisht",
      "Italian": "Italisht",
      "German": "Gjermanisht",
      "Home": "Kryefaqja",
      "Fleet": "Flota",
      "Our Fleet": "Flota jone",
      "Faqs": "Pyetjet e shpeshta",
      "FAQ": "FAQ",
      "Quick Links": "Lidhje te shpejta",
      "Locations": "Lokacionet",
      "Contact": "Kontakt",
      "Contact us on WhatsApp": "Na kontaktoni ne WhatsApp",
      "Privacy Policy": "Politika e Privatesise",
      "Terms & Conditions": "Termat dhe Kushtet",
      "Payment method: Cash only.": "Menyra e pageses: Vetem cash.",
      "Explore Albania": "Eksploro Shqiperine",
      "Your Way": "Sipas menyres tende",
      "Rent a car with zero hidden fees. Pay cash on arrival. No credit card needed.": "Merr makine me qira pa tarifa te fshehura. Paguaj cash ne mbritje. Nuk duhet karte krediti.",
      "Pickup Location": "Vendi i marrjes",
      "Drop-off Location": "Vendi i dorezimit",
      "Drop-off at same location": "Dorezoje ne te njejtin vend",
      "Pick-up Date": "Data e marrjes",
      "Pick-up Time": "Ora e marrjes",
      "Drop-off Date": "Data e dorezimit",
      "Drop-off Time": "Ora e dorezimit",
      "Search Available Cars": "Kerko makina te disponueshme",
      "Our Certifications": "Certifikimet tona",
      "Ministry of Tourism Certified": "I certifikuar nga Ministria e Turizmit",
      "Professional Rental Association": "Shoqate profesionale e qiradhenies",
      "Clean Vehicle Guarantee": "Garanci per automjete te pastra",
      "Full Insurance Coverage": "Mbulim i plote sigurimi",
      "24/7 Roadside Assistance": "Asistence rrugore 24/7",
      "Cash Only Payment": "Pagese vetem cash",
      "No credit card needed. Pay in cash when you pick up your car.": "Nuk duhet karte krediti. Paguaj cash kur merr makinen.",
      "Full Insurance": "Sigurim i plote",
      "All vehicles come with comprehensive insurance coverage included.": "Te gjitha automjetet perfshijne mbulim te plote sigurimi.",
      "24/7 Support": "Mbeshtejte 24/7",
      "Reach us anytime via phone or WhatsApp for roadside assistance.": "Na kontaktoni ne cdo kohe me telefon ose WhatsApp per asistence rrugore.",
      "What our guest say": "Cfare thone klientet tane",
      "Average Rating": "Vleresimi mesatar",
      "Happy Customers": "Kliente te kenaqur",
      "Quality Vehicles": "Automjete cilesore",
      "Pickup Locations": "Vende marrjeje",
      "Date": "Data",
      "Edit dates": "Ndrysho datat",
      "Booking": "Rezervimi",
      "Cars Available": "Makina te disponueshme",
      "All": "Te gjitha",
      "Sedan": "Sedan",
      "Economy": "Ekonomike",
      "Compact": "Kompakte",
      "Suv": "SUV",
      "SUV": "SUV",
      "Van": "Furgon",
      "Luxury": "Luksoze",
      "Show Filters": "Shfaq filtrat",
      "Sort by:": "Rendit sipas:",
      "Most popular": "Me te njohurat",
      "Lowest to High Price": "Cmimi nga i uleti te i larti",
      "Highest to Low Price": "Cmimi nga i larti te i uleti",
      "Newest Listings": "Me te rejat",
      "FILTERS": "FILTRAT",
      "Automatic Transmission": "Kambio automatike",
      "Automatic Transmission ": "Kambio automatike",
      "4+ seats": "4+ vende",
      "Air Conditioning": "Kondicioner",
      "Electric": "Elektrike",
      "Unlimited Mileage": "Kilometrazh i pakufizuar",
      "Free Cancellation": "Anulim falas",
      "Special Offers": "Oferta speciale",
      "Reset All": "Rivendos te gjitha",
      "Advanced Filters": "Filtra te avancuar",
      "VEHICLES": "AUTOMJETE",
      "DAYS": "DITE",
      "Change the location": "Ndrysho vendin",
      "Update Filters": "Perditeso filtrat",
      "Vehicle Brand": "Marka e automjetit",
      "Vehicle Model": "Modeli i automjetit",
      "Vehicle Year": "Viti i automjetit",
      "Drive System": "Sistemi i drejtimit",
      "Fuel Type": "Lloji i karburantit",
      "Driver Experience": "Eksperienca e shoferit",
      "Luggage Capacity": "Kapaciteti i bagazhit",
      "Seating Capacity": "Kapaciteti i vendeve",
      "Insurance": "Sigurimi",
      "Deposit Requirements": "Kerkesat e depozites",
      "Apply Filters": "Apliko filtrat",
      "Manual": "Manuale",
      "Automatic": "Automatike",
      "Petrol": "Benzine",
      "Diesel": "Dizel",
      "Hybrid": "Hibride",
      "Plug-in Hybrid": "Hibride plug-in",
      "LPG": "LPG",
      "Under 21": "Nen 21",
      "Over 25": "Mbi 25",
      "Any year": "Cdo vit",
      "2025 or newer": "2025 ose me i ri",
      "2023 or newer": "2023 ose me i ri",
      "2020 or newer": "2020 ose me i ri",
      "No Insurance Included": "Pa sigurim te perfshire",
      "Premium": "Premium",
      "Basic": "Baze",
      "No Deposit": "Pa depozite",
      "No cars match your filters.": "Asnje makine nuk perputhet me filtrat.",
      "Please reset your filters.": "Ju lutemi rivendosni filtrat.",
      "Failed to load cars.": "Ngarkimi i makinave deshtoi.",
      "Please try again later.": "Ju lutemi provoni perseri me vone.",
      "No cars available at this moment": "Nuk ka makina te disponueshme per momentin",
      "From": "Nga",
      "per day": "ne dite",
      "View Details": "Shiko detajet",
      "Seats": "Vende",
      "Seat": "Vend",
      "Bags": "Canta",
      "Bag": "Cante",
      "Doors": "Dyer",
      "Door": "Dere",
      "24/7 Assistance": "Asistence 24/7",
      "No insurance": "Pa sigurim",
      "Premium insurance": "Sigurim premium",
      "Basic insurance": "Sigurim baze",
      "No deposit required": "Nuk kerkohet depozite",
      "Car Name": "Emri i makines",
      "Share": "Shperndaj",
      "Faqs": "FAQ",
      "Overview": "Permbledhje",
      "Best for": "Me e mira per",
      "Rental Conditions": "Kushtet e qirase",
      "Depostit & Payment": "Depozita dhe pagesa",
      "Deposit & Payment": "Depozita dhe pagesa",
      "Deposit:": "Depozita:",
      "(refundable upon return)": "(e rimbursueshme pas kthimit)",
      "All payments are processed in CASH ONLY at the time of vehicle collection. No online payments required.": "Te gjitha pagesat kryhen vetem CASH ne momentin e marrjes se automjetit. Nuk kerkohen pagesa online.",
      "Mileage Policy": "Politika e kilometrazhit",
      "Unlimited mileage included": "Kilometrazh i pakufizuar i perfshire",
      "Unlimited mileage": "Kilometrazh i pakufizuar",
      "Fuel Policy": "Politika e karburantit",
      "Full-to-Full:": "Plot-me-plot:",
      "You receive the car with a full tank and return it with a full tank.": "E merrni makinen me serbator plot dhe e ktheni me serbator plot.",
      "Cross-Border Travel": "Udhetim nderkufitar",
      "This vehicle is authorized for travel throughout Europe.": "Ky automjet eshte i autorizuar per udhetime ne te gjithe Evropen.",
      "Ferry Travel": "Udhetim me traget",
      "Documents Required": "Dokumentet e nevojshme",
      "Valid passport or national ID card": "Pasaporte ose karte identiteti e vlefshme",
      "Valid driver's license (held for at least 2 years)": "Patente e vlefshme (e mbajtur te pakten 2 vjet)",
      "International Driving Permit (for non-EU licenses)": "Leje nderkombetare drejtimi (per patentat jo-BE)",
      "Driver Requirements": "Kerkesat per shoferin",
      "Minimum age: 21 years": "Mosha minimale: 21 vjec",
      "Maximum age: 75 years": "Mosha maksimale: 75 vjec",
      "License held for at least 2 years": "Patenta e mbajtur te pakten 2 vjet",
      "Cancelation Policy": "Politika e anulimit",
      "Cancellation Policy": "Politika e anulimit",
      "Free cancellation up to 48 hours before pickup": "Anulim falas deri 48 ore para marrjes",
      "Modifications allowed via email or WhatsApp": "Ndryshimet lejohen me email ose WhatsApp",
      "Price Summary": "Permbledhja e cmimit",
      "Daily rate x": "Cmimi ditor x",
      "days": "dite",
      "Taxes & fees": "Taksa dhe tarifa",
      "Included": "Te perfshira",
      "Total": "Totali",
      "Cash Payment Only": "Pagese vetem cash",
      "Pay in cash when you collect the vehicle. No credit card required.": "Paguani cash kur merrni automjetin. Nuk kerkohet karte krediti.",
      "Book Now": "Rezervo tani",
      "You will receive a confirmation email shortly": "Do te merrni se shpejti nje email konfirmimi",
      "Free cancellation (48h)": "Anulim falas (48h)",
      "Questions? WhatsApp us": "Pyetje? Na shkruani ne WhatsApp",
      "Vehicle": "Automjeti",
      "Extras & rules": "Shtesa dhe rregulla",
      "Driver details": "Detajet e shoferit",
      "Complete Your Rental Inquiry": "Plotesoni kerkesen tuaj te qirase",
      "Submit your booking details below. Our team will confirm availability and send payment instructions via email within 12 hours.": "Dergoni detajet e rezervimit me poshte. Ekipi yne do te konfirmoje disponueshmerine dhe do te dergoje udhezimet e pageses me email brenda 12 oresh.",
      "Optional Addons": "Shtesa opsionale",
      "The fine print, made plain.": "Kushtet, te shpjeguara thjesht.",
      "Deposit & payment": "Depozita dhe pagesa",
      "No card hold": "Pa bllokim karte",
      "No card hold · No deposit required": "Pa bllokim karte - nuk kerkohet depozite",
      "Please select the countries you plan to visit from the list below": "Zgjidhni vendet qe planifikoni te vizitoni nga lista me poshte",
      "Milage policy": "Politika e kilometrazhit",
      "Unlimited within albania": "Pa kufi brenda Shqiperise",
      "No daily cap within the Albanian borders.": "Nuk ka limit ditor brenda kufijve te Shqiperise.",
      "Documents required": "Dokumentet e nevojshme",
      "Passport · Driving license": "Pasaporte - patente",
      "Driver requirements": "Kerkesat per shoferin",
      "Cancellation": "Anulimi",
      "Contact Information": "Informacioni i kontaktit",
      "Full name": "Emri i plote",
      "Email": "Email",
      "Phone Number": "Numri i telefonit",
      "We'll contact you via email or whatsapp for confirmation": "Do t'ju kontaktojme me email ose WhatsApp per konfirmim",
      "Driver Information": "Informacioni i shoferit",
      "Driver's Full Name": "Emri i plote i shoferit",
      "Driver's Age": "Mosha e shoferit",
      "License Expiry Date": "Data e skadimit te patentes",
      "Special Requests": "Kerkesa te vecanta",
      "Maximum 500 characters": "Maksimumi 500 karaktere",
      "Location Details": "Detajet e lokacionit",
      "Change Now": "Ndrysho tani",
      "Pick Up Location:": "Vendi i marrjes:",
      "Drop Off Location:": "Vendi i dorezimit:",
      "Price Breakdown": "Ndarja e cmimit",
      "I agree to the": "Pajtohem me",
      "and": "dhe",
      "Continue to driver details": "Vazhdo te detajet e shoferit",
      "Send Inquiry": "Dergo kerkesen",
      "No cross-border travel allowed for this car.": "Udhetimi nderkufitar nuk lejohet per kete makine.",
      "Select the countries you plan to visit from the list below.": "Zgjidhni vendet qe planifikoni te vizitoni nga lista me poshte.",
      "All Brands": "Te gjitha markat",
      "All Models": "Te gjitha modelet",
      "Pickup date": "Data e marrjes",
      "Dropoff date": "Data e dorezimit",
      "Select Date": "Zgjidh daten",
      "Any special requests or additional information...": "Cdo kerkese e vecante ose informacion shtese...",
      "All rights reserved.": "Te gjitha te drejtat e rezervuara.",
      "© 2025 Dua Makina. All rights reserved.": "© 2025 Dua Makina. Te gjitha te drejtat e rezervuara.",
      "© 2024 Dua Makina. All rights reserved.": "© 2024 Dua Makina. Te gjitha te drejtat e rezervuara.",
      "automatic": "Automatike",
      "manual": "Manuale"
    },
    it: {
      "English": "Inglese",
      "Albanian": "Albanese",
      "French": "Francese",
      "Italian": "Italiano",
      "German": "Tedesco",
      "Home": "Home",
      "Fleet": "Flotta",
      "Our Fleet": "La nostra flotta",
      "Faqs": "FAQ",
      "FAQ": "FAQ",
      "Quick Links": "Link rapidi",
      "Locations": "Localita",
      "Contact": "Contatto",
      "Contact us on WhatsApp": "Contattaci su WhatsApp",
      "Privacy Policy": "Informativa sulla privacy",
      "Terms & Conditions": "Termini e condizioni",
      "Payment method: Cash only.": "Metodo di pagamento: solo contanti.",
      "Explore Albania": "Esplora l'Albania",
      "Your Way": "A modo tuo",
      "Rent a car with zero hidden fees. Pay cash on arrival. No credit card needed.": "Noleggia un'auto senza costi nascosti. Paga in contanti all'arrivo. Nessuna carta di credito richiesta.",
      "Pickup Location": "Luogo di ritiro",
      "Drop-off Location": "Luogo di riconsegna",
      "Drop-off at same location": "Riconsegna nello stesso luogo",
      "Pick-up Date": "Data di ritiro",
      "Pick-up Time": "Ora di ritiro",
      "Drop-off Date": "Data di riconsegna",
      "Drop-off Time": "Ora di riconsegna",
      "Search Available Cars": "Cerca auto disponibili",
      "Our Certifications": "Le nostre certificazioni",
      "Ministry of Tourism Certified": "Certificato dal Ministero del Turismo",
      "Professional Rental Association": "Associazione professionale di noleggio",
      "Clean Vehicle Guarantee": "Garanzia veicolo pulito",
      "Full Insurance Coverage": "Copertura assicurativa completa",
      "24/7 Roadside Assistance": "Assistenza stradale 24/7",
      "Cash Only Payment": "Pagamento solo in contanti",
      "No credit card needed. Pay in cash when you pick up your car.": "Nessuna carta di credito richiesta. Paga in contanti al ritiro dell'auto.",
      "Full Insurance": "Assicurazione completa",
      "All vehicles come with comprehensive insurance coverage included.": "Tutti i veicoli includono copertura assicurativa completa.",
      "24/7 Support": "Supporto 24/7",
      "Reach us anytime via phone or WhatsApp for roadside assistance.": "Contattaci in qualsiasi momento per telefono o WhatsApp per assistenza stradale.",
      "What our guest say": "Cosa dicono i nostri clienti",
      "Average Rating": "Valutazione media",
      "Happy Customers": "Clienti soddisfatti",
      "Quality Vehicles": "Veicoli di qualita",
      "Pickup Locations": "Luoghi di ritiro",
      "Date": "Data",
      "Edit dates": "Modifica date",
      "Booking": "Prenotazione",
      "Cars Available": "Auto disponibili",
      "All": "Tutte",
      "Sedan": "Berlina",
      "Economy": "Economica",
      "Compact": "Compatta",
      "Suv": "SUV",
      "SUV": "SUV",
      "Van": "Van",
      "Luxury": "Lusso",
      "Show Filters": "Mostra filtri",
      "Sort by:": "Ordina per:",
      "Most popular": "Piu popolari",
      "Lowest to High Price": "Prezzo dal piu basso",
      "Highest to Low Price": "Prezzo dal piu alto",
      "Newest Listings": "Annunci piu recenti",
      "FILTERS": "FILTRI",
      "Automatic Transmission": "Cambio automatico",
      "Automatic Transmission ": "Cambio automatico",
      "4+ seats": "4+ posti",
      "Air Conditioning": "Aria condizionata",
      "Electric": "Elettrica",
      "Unlimited Mileage": "Chilometraggio illimitato",
      "Free Cancellation": "Cancellazione gratuita",
      "Special Offers": "Offerte speciali",
      "Reset All": "Reimposta tutto",
      "Advanced Filters": "Filtri avanzati",
      "VEHICLES": "VEICOLI",
      "DAYS": "GIORNI",
      "Change the location": "Cambia localita",
      "Update Filters": "Aggiorna filtri",
      "Vehicle Brand": "Marca veicolo",
      "Vehicle Model": "Modello veicolo",
      "Vehicle Year": "Anno veicolo",
      "Drive System": "Sistema di trazione",
      "Fuel Type": "Tipo carburante",
      "Driver Experience": "Esperienza del conducente",
      "Luggage Capacity": "Capacita bagagli",
      "Seating Capacity": "Capacita posti",
      "Insurance": "Assicurazione",
      "Deposit Requirements": "Requisiti deposito",
      "Apply Filters": "Applica filtri",
      "Manual": "Manuale",
      "Automatic": "Automatico",
      "Petrol": "Benzina",
      "Gasoline": "Benzina",
      "Diesel": "Diesel",
      "Hybrid": "Ibrida",
      "Plug-in Hybrid": "Ibrida plug-in",
      "LPG": "GPL",
      "Under 21": "Sotto 21",
      "Over 25": "Oltre 25",
      "Any year": "Qualsiasi anno",
      "2025 or newer": "2025 o piu recente",
      "2023 or newer": "2023 o piu recente",
      "2020 or newer": "2020 o piu recente",
      "No Insurance Included": "Nessuna assicurazione inclusa",
      "Premium": "Premium",
      "Basic": "Base",
      "No Deposit": "Nessun deposito",
      "No cars match your filters.": "Nessuna auto corrisponde ai filtri.",
      "Please reset your filters.": "Reimposta i filtri.",
      "Failed to load cars.": "Impossibile caricare le auto.",
      "Please try again later.": "Riprova piu tardi.",
      "No cars available at this moment": "Nessuna auto disponibile al momento",
      "From": "Da",
      "per day": "al giorno",
      "View Details": "Vedi dettagli",
      "Seats": "Posti",
      "Seat": "Posto",
      "Bags": "Bagagli",
      "Bag": "Bagaglio",
      "Doors": "Porte",
      "Door": "Porta",
      "24/7 Assistance": "Assistenza 24/7",
      "No insurance": "Nessuna assicurazione",
      "Premium insurance": "Assicurazione premium",
      "Basic insurance": "Assicurazione base",
      "No deposit required": "Nessun deposito richiesto",
      "Car Name": "Nome auto",
      "Share": "Condividi",
      "Overview": "Panoramica",
      "Best for": "Ideale per",
      "Rental Conditions": "Condizioni di noleggio",
      "Depostit & Payment": "Deposito e pagamento",
      "Deposit & Payment": "Deposito e pagamento",
      "Deposit:": "Deposito:",
      "(refundable upon return)": "(rimborsabile alla riconsegna)",
      "All payments are processed in CASH ONLY at the time of vehicle collection. No online payments required.": "Tutti i pagamenti vengono effettuati solo in contanti al ritiro del veicolo. Nessun pagamento online richiesto.",
      "Mileage Policy": "Politica chilometraggio",
      "Unlimited mileage included": "Chilometraggio illimitato incluso",
      "Unlimited mileage": "Chilometraggio illimitato",
      "Fuel Policy": "Politica carburante",
      "Full-to-Full:": "Pieno-pieno:",
      "You receive the car with a full tank and return it with a full tank.": "Ricevi l'auto con il pieno e la riconsegni con il pieno.",
      "Cross-Border Travel": "Viaggi transfrontalieri",
      "This vehicle is authorized for travel throughout Europe.": "Questo veicolo e autorizzato a viaggiare in tutta Europa.",
      "Ferry Travel": "Viaggi in traghetto",
      "Documents Required": "Documenti richiesti",
      "Valid passport or national ID card": "Passaporto o carta d'identita valida",
      "Valid driver's license (held for at least 2 years)": "Patente valida (posseduta da almeno 2 anni)",
      "International Driving Permit (for non-EU licenses)": "Permesso internazionale di guida (per patenti extra UE)",
      "Driver Requirements": "Requisiti conducente",
      "Minimum age: 21 years": "Eta minima: 21 anni",
      "Maximum age: 75 years": "Eta massima: 75 anni",
      "License held for at least 2 years": "Patente posseduta da almeno 2 anni",
      "Cancelation Policy": "Politica di cancellazione",
      "Cancellation Policy": "Politica di cancellazione",
      "Free cancellation up to 48 hours before pickup": "Cancellazione gratuita fino a 48 ore prima del ritiro",
      "Modifications allowed via email or WhatsApp": "Modifiche consentite via email o WhatsApp",
      "Price Summary": "Riepilogo prezzo",
      "Daily rate x": "Tariffa giornaliera x",
      "days": "giorni",
      "Taxes & fees": "Tasse e commissioni",
      "Included": "Incluse",
      "Total": "Totale",
      "Cash Payment Only": "Pagamento solo in contanti",
      "Pay in cash when you collect the vehicle. No credit card required.": "Paga in contanti al ritiro del veicolo. Nessuna carta di credito richiesta.",
      "Book Now": "Prenota ora",
      "You will receive a confirmation email shortly": "Riceverai presto un'email di conferma",
      "Free cancellation (48h)": "Cancellazione gratuita (48h)",
      "Questions? WhatsApp us": "Domande? Scrivici su WhatsApp",
      "Vehicle": "Veicolo",
      "Extras & rules": "Extra e regole",
      "Driver details": "Dati conducente",
      "Complete Your Rental Inquiry": "Completa la richiesta di noleggio",
      "Submit your booking details below. Our team will confirm availability and send payment instructions via email within 12 hours.": "Invia i dettagli della prenotazione qui sotto. Il nostro team confermera la disponibilita e inviera le istruzioni di pagamento via email entro 12 ore.",
      "Optional Addons": "Extra opzionali",
      "The fine print, made plain.": "Le condizioni, spiegate chiaramente.",
      "Deposit & payment": "Deposito e pagamento",
      "No card hold": "Nessun blocco carta",
      "No card hold · No deposit required": "Nessun blocco carta - nessun deposito richiesto",
      "Please select the countries you plan to visit from the list below": "Seleziona dall'elenco i paesi che prevedi di visitare",
      "Milage policy": "Politica chilometraggio",
      "Unlimited within albania": "Illimitato in Albania",
      "No daily cap within the Albanian borders.": "Nessun limite giornaliero entro i confini albanesi.",
      "Documents required": "Documenti richiesti",
      "Passport · Driving license": "Passaporto - patente",
      "Driver requirements": "Requisiti conducente",
      "Cancellation": "Cancellazione",
      "Contact Information": "Informazioni di contatto",
      "Full name": "Nome completo",
      "Email": "Email",
      "Phone Number": "Numero di telefono",
      "We'll contact you via email or whatsapp for confirmation": "Ti contatteremo via email o WhatsApp per conferma",
      "Driver Information": "Informazioni conducente",
      "Driver's Full Name": "Nome completo del conducente",
      "Driver's Age": "Eta del conducente",
      "License Expiry Date": "Scadenza patente",
      "Special Requests": "Richieste speciali",
      "Maximum 500 characters": "Massimo 500 caratteri",
      "Location Details": "Dettagli localita",
      "Change Now": "Cambia ora",
      "Pick Up Location:": "Luogo di ritiro:",
      "Drop Off Location:": "Luogo di riconsegna:",
      "Price Breakdown": "Dettaglio prezzo",
      "I agree to the": "Accetto i",
      "and": "e",
      "Continue to driver details": "Continua ai dati conducente",
      "Send Inquiry": "Invia richiesta",
      "No cross-border travel allowed for this car.": "Per questa auto non sono consentiti viaggi transfrontalieri.",
      "Select the countries you plan to visit from the list below.": "Seleziona dall'elenco i paesi che prevedi di visitare.",
      "All Brands": "Tutte le marche",
      "All Models": "Tutti i modelli",
      "Pickup date": "Data di ritiro",
      "Dropoff date": "Data di riconsegna",
      "Select Date": "Seleziona data",
      "Any special requests or additional information...": "Richieste speciali o informazioni aggiuntive...",
      "All rights reserved.": "Tutti i diritti riservati.",
      "© 2025 Dua Makina. All rights reserved.": "© 2025 Dua Makina. Tutti i diritti riservati.",
      "© 2024 Dua Makina. All rights reserved.": "© 2024 Dua Makina. Tutti i diritti riservati.",
      "automatic": "Automatico",
      "manual": "Manuale"
    }
  };

  const fromItalian = {
    fr: {
      "Flotta": "Flotte",
      "La nostra flotta": "Notre flotte",
      "Link rapidi": "Liens rapides",
      "Localita": "Lieux",
      "Contatto": "Contact",
      "Contattaci su WhatsApp": "Contactez-nous sur WhatsApp",
      "Informativa sulla privacy": "Politique de confidentialite",
      "Termini e condizioni": "Conditions generales",
      "Esplora l'Albania": "Explorez l'Albanie",
      "A modo tuo": "A votre facon",
      "Luogo di ritiro": "Lieu de prise en charge",
      "Luogo di riconsegna": "Lieu de retour",
      "Data di ritiro": "Date de retrait",
      "Ora di ritiro": "Heure de prise",
      "Data di riconsegna": "Date de retour",
      "Ora di riconsegna": "Heure de retour",
      "Cerca auto disponibili": "Rechercher des voitures disponibles",
      "Pagamento solo in contanti": "Paiement en especes uniquement",
      "Assicurazione completa": "Assurance complete",
      "Supporto 24/7": "Assistance 24/7",
      "Auto disponibili": "Voitures disponibles",
      "Mostra filtri": "Afficher les filtres",
      "Ordina per:": "Trier par :",
      "Piu popolari": "Les plus populaires",
      "Prezzo dal piu basso": "Prix croissant",
      "Prezzo dal piu alto": "Prix decroissant",
      "Annunci piu recenti": "Annonces recentes",
      "FILTRI": "FILTRES",
      "Cambio automatico": "Boite automatique",
      "4+ posti": "4+ places",
      "Aria condizionata": "Climatisation",
      "Elettrica": "Electrique",
      "Chilometraggio illimitato": "Kilometrage illimite",
      "Cancellazione gratuita": "Annulation gratuite",
      "Offerte speciali": "Offres speciales",
      "Reimposta tutto": "Tout reinitialiser",
      "Filtri avanzati": "Filtres avances",
      "Aggiorna filtri": "Mettre a jour les filtres",
      "Marca veicolo": "Marque du vehicule",
      "Modello veicolo": "Modele du vehicule",
      "Tipo carburante": "Type de carburant",
      "Esperienza del conducente": "Experience du conducteur",
      "Capacita bagagli": "Capacite bagages",
      "Capacita posti": "Nombre de places",
      "Assicurazione": "Assurance",
      "Applica filtri": "Appliquer les filtres",
      "Manuale": "Manuelle",
      "Automatico": "Automatique",
      "Benzina": "Essence",
      "Ibrida": "Hybride",
      "Nessuna auto corrisponde ai filtri.": "Aucune voiture ne correspond aux filtres.",
      "Impossibile caricare le auto.": "Impossible de charger les voitures.",
      "Riprova piu tardi.": "Veuillez reessayer plus tard.",
      "Da": "A partir de",
      "al giorno": "par jour",
      "Vedi dettagli": "Voir les details",
      "Posti": "Places",
      "Bagagli": "Bagages",
      "Porte": "Portes",
      "Panoramica": "Apercu",
      "Conditions de noleggio": "Conditions de location",
      "Deposito e pagamento": "Depot et paiement",
      "Politica chilometraggio": "Politique de kilometrage",
      "Politica carburante": "Politique de carburant",
      "Viaggi transfrontalieri": "Voyages transfrontaliers",
      "Viaggi in traghetto": "Voyages en ferry",
      "Documenti richiesti": "Documents requis",
      "Requisiti conducente": "Conditions conducteur",
      "Riepilogo prezzo": "Resume du prix",
      "Tariffa giornaliera x": "Tarif journalier x",
      "giorni": "jours",
      "Tasse e commissioni": "Taxes et frais",
      "Incluse": "Inclus",
      "Totale": "Total",
      "Prenota ora": "Reserver",
      "Veicolo": "Vehicule",
      "Extra e regole": "Extras et regles",
      "Dati conducente": "Details conducteur",
      "Extra opzionali": "Extras optionnels",
      "Informazioni di contatto": "Coordonnees",
      "Nome completo": "Nom complet",
      "Numero di telefono": "Numero de telephone",
      "Informazioni conducente": "Informations conducteur",
      "Richieste speciali": "Demandes speciales",
      "Dettagli localita": "Details du lieu",
      "Cambia ora": "Modifier",
      "Dettaglio prezzo": "Detail du prix",
      "Invia richiesta": "Envoyer la demande",
      "Tutti i diritti riservati.": "Tous droits réservés.",
      "© 2025 Dua Makina. Tutti i diritti riservati.": "© 2025 Dua Makina. Tous droits réservés.",
      "© 2024 Dua Makina. Tutti i diritti riservati.": "© 2024 Dua Makina. Tous droits réservés."
    },
    de: {
      "Flotta": "Flotte",
      "La nostra flotta": "Unsere Flotte",
      "Link rapidi": "Schnelllinks",
      "Localita": "Standorte",
      "Contatto": "Kontakt",
      "Contattaci su WhatsApp": "Kontakt per WhatsApp",
      "Informativa sulla privacy": "Datenschutzrichtlinie",
      "Termini e condizioni": "Allgemeine Geschaeftsbedingungen",
      "Esplora l'Albania": "Entdecke Albanien",
      "A modo tuo": "Auf deine Art",
      "Luogo di ritiro": "Abholort",
      "Luogo di riconsegna": "Rueckgabeort",
      "Data di ritiro": "Abholdatum",
      "Ora di ritiro": "Abholzeit",
      "Data di riconsegna": "Rueckgabedatum",
      "Ora di riconsegna": "Rueckgabezeit",
      "Cerca auto disponibili": "Verfuegbare Autos suchen",
      "Pagamento solo in contanti": "Nur Barzahlung",
      "Assicurazione completa": "Vollversicherung",
      "Supporto 24/7": "24/7 Support",
      "Auto disponibili": "Autos verfuegbar",
      "Mostra filtri": "Filter anzeigen",
      "Ordina per:": "Sortieren nach:",
      "Piu popolari": "Beliebteste",
      "Prezzo dal piu basso": "Preis aufsteigend",
      "Prezzo dal piu alto": "Preis absteigend",
      "Annunci piu recenti": "Neueste Angebote",
      "FILTRI": "FILTER",
      "Cambio automatico": "Automatikgetriebe",
      "4+ posti": "4+ Sitze",
      "Aria condizionata": "Klimaanlage",
      "Elettrica": "Elektrisch",
      "Chilometraggio illimitato": "Unbegrenzte Kilometer",
      "Cancellazione gratuita": "Kostenlose Stornierung",
      "Offerte speciali": "Sonderangebote",
      "Reimposta tutto": "Alles zuruecksetzen",
      "Filtri avanzati": "Erweiterte Filter",
      "Aggiorna filtri": "Filter aktualisieren",
      "Marca veicolo": "Fahrzeugmarke",
      "Modello veicolo": "Fahrzeugmodell",
      "Tipo carburante": "Kraftstoffart",
      "Esperienza del conducente": "Fahrerfahrung",
      "Capacita bagagli": "Gepaeckkapazitaet",
      "Capacita posti": "Sitzkapazitaet",
      "Assicurazione": "Versicherung",
      "Applica filtri": "Filter anwenden",
      "Manuale": "Manuell",
      "Automatico": "Automatik",
      "Benzina": "Benzin",
      "Ibrida": "Hybrid",
      "Nessuna auto corrisponde ai filtri.": "Kein Auto passt zu deinen Filtern.",
      "Impossibile caricare le auto.": "Autos konnten nicht geladen werden.",
      "Riprova piu tardi.": "Bitte versuche es spaeter erneut.",
      "Da": "Ab",
      "al giorno": "pro Tag",
      "Vedi dettagli": "Details ansehen",
      "Posti": "Sitze",
      "Bagagli": "Gepaeck",
      "Porte": "Tueren",
      "Panoramica": "Uebersicht",
      "Deposito e pagamento": "Kaution und Zahlung",
      "Politica chilometraggio": "Kilometerregelung",
      "Politica carburante": "Kraftstoffregelung",
      "Viaggi transfrontalieri": "Grenzuebertritte",
      "Viaggi in traghetto": "Faehrreisen",
      "Documenti richiesti": "Erforderliche Dokumente",
      "Requisiti conducente": "Fahreranforderungen",
      "Riepilogo prezzo": "Preisuebersicht",
      "Tariffa giornaliera x": "Tagesrate x",
      "giorni": "Tage",
      "Tasse e commissioni": "Steuern und Gebuehren",
      "Incluse": "Inklusive",
      "Totale": "Gesamt",
      "Prenota ora": "Jetzt buchen",
      "Veicolo": "Fahrzeug",
      "Extra e regole": "Extras und Regeln",
      "Dati conducente": "Fahrerdaten",
      "Extra opzionali": "Optionale Extras",
      "Informazioni di contatto": "Kontaktinformationen",
      "Nome completo": "Vollstaendiger Name",
      "Numero di telefono": "Telefonnummer",
      "Informazioni conducente": "Fahrerinformationen",
      "Richieste speciali": "Sonderwuensche",
      "Dettagli localita": "Standortdetails",
      "Cambia ora": "Jetzt aendern",
      "Dettaglio prezzo": "Preisaufschluesselung",
      "Invia richiesta": "Anfrage senden",
      "Tutti i diritti riservati.": "Alle Rechte vorbehalten.",
      "© 2025 Dua Makina. Tutti i diritti riservati.": "© 2025 Dua Makina. Alle Rechte vorbehalten.",
      "© 2024 Dua Makina. Tutti i diritti riservati.": "© 2024 Dua Makina. Alle Rechte vorbehalten."
    }
  };

  phraseMap.fr = buildDerivedMap("fr");
  phraseMap.de = buildDerivedMap("de");

  const extraTranslations = {
    sq: {
      "Last updated: June 9, 2026": "Perditesuar se fundmi: 9 qershor 2026",
      "Demo notice:": "Njoftim demo:",
      "Who We Are": "Kush jemi",
      "Current Website Status": "Statusi aktual i faqes",
      "Personal Data We May Collect": "Te dhenat personale qe mund te mbledhim",
      "How We Use Data": "Si i perdorim te dhenat",
      "Third-Party Services": "Sherbime te paleve te treta",
      "Cookies And Local Storage": "Cookies dhe ruajtja lokale",
      "Data Retention": "Ruajtja e te dhenave",
      "Your Rights": "Te drejtat tuaja",
      "Website Status": "Statusi i faqes",
      "No Real Bookings": "Nuk ka rezervime reale",
      "No Price Or Availability Guarantee": "Pa garanci cmimi ose disponueshmerie",
      "Future Rental Terms Placeholder": "Kushtet e ardhshme te qirase",
      "User Responsibilities": "Pergjegjesite e perdoruesit",
      "Limitation Of Liability": "Kufizimi i pergjegjesise",
      "Questions about these terms can be sent to": "Pyetjet per keto kushte mund te dergohen te",
      "this website is currently for demonstration and testing only. Booking requests submitted through this website are not real reservations and do not create a rental contract.": "kjo faqe eshte aktualisht vetem per demonstrim dhe testim. Kerkesat e rezervimit te derguara ne kete faqe nuk jane rezervime reale dhe nuk krijojne kontrate qiraje.",
      "this website is currently for demonstration and testing only. Booking requests are not real reservations, do not guarantee vehicle availability, and do not create a rental contract.": "kjo faqe eshte aktualisht vetem per demonstrim dhe testim. Kerkesat e rezervimit nuk jane rezervime reale, nuk garantojne disponueshmeri automjeti dhe nuk krijojne kontrate qiraje.",
      "Dua Makina is an Albania-based car rental website concept. You can contact us at": "Dua Makina eshte nje koncept faqeje per makina me qira ne Shqiperi. Mund te na kontaktoni te",
      "The website may use local storage or similar browser storage for selected language, currency, booking search details, cached vehicle data, and inquiry cooldown checks. Third-party services may use cookies or equivalent technologies for security, analytics, or delivery.": "Faqja mund te perdore local storage ose ruajtje te ngjashme te shfletuesit per gjuhen, monedhen, detajet e kerkimit, te dhenat e makinave ne cache dhe kontrollet e formularit. Sherbimet e paleve te treta mund te perdorin cookies ose teknologji te ngjashme per siguri, analitike ose shperndarje.",
      "car transmission": "Kambio e makines",
      "Insurance type": "Lloji i sigurimit",
      "Car year": "Viti i makines",
      "car seats": "Vendet e makines",
      "car trunk capacity": "Kapaciteti i bagazhit",
      "car doors": "Dyer te makines",
      "A/C": "Kondicioner",
      "car fuel type": "Lloji i karburantit",
      "Ferry travel to Greece (Saranda-Corfu) and Italy (Durres-Bari) is allowed with prior notice. Please inform us when booking.": "Udhetimi me traget ne Greqi (Saranda-Korfuz) dhe Itali (Durres-Bari) lejohet me njoftim paraprak. Ju lutemi na njoftoni gjate rezervimit.",
      "No card hold ·": "Pa bllokim karte ·",
      "We never take a card hold.": "Ne nuk bllokojme kurre karte.",
      "A small": "Nje depozite e vogel",
      "cash deposit is collected at pickup, returned at drop-off": "cash mbledhet ne marrje, kthehet ne dorezim",
      ". The full rental is also paid in cash on collection — EUR, USD, LEK, or GBP.": ". Qiraja e plote paguhet gjithashtu ne cash ne marrje — EUR, USD, LEK, ose GBP.",
      "Min age": "Mosha min.",
      "Max age 75": "Mosha maks. 75",
      "2+ years license": "2+ vjet patente",
      "The named driver must be present at pickup. Additional drivers (max 2) must also be present and add": "Shoferi i emeruar duhet te jete i pranishem ne marrje. Shoferet shtes (maks 2) duhet te jene gjithashtu te pranishem dhe shtojne",
      "/day each. Young driver surcharge of": "/dite secili. Tatimi per shofer te ri prej",
      "/day applies between ages 21-22.": "/dite zbatohet per moshen 21-22.",
      "Free up to 48h before · 50% within 48h · No-show forfeits": "Falas deri 48h para · 50% brenda 48h · Humbje ne rast mosprezencie",
      "Cancel via email or by WhatsApp. Inside 48h we keep": "Anulo me email ose WhatsApp. Brenda 48h mbajme",
      "admin fee or 50% of the rental, whichever is lower. Schedule changes up to 6h before pickup are free.": "taksa administrimi ose 50% e qirases, cfaredo qe eshte me e ulet. Ndryshimet e orarit deri 6h para marrjes jane falas.",
      "Bring your original passport (not just a photo) and a driving license held for at least 2 years. EU, UK, US, CA, AU, NZ, JP, CH licenses are accepted directly. Other licenses need an International Driving Permit. We photograph documents at pickup; copies are stored for 12 months and then deleted.": "Sillni pasaporten tuaj origjinale (jo vetem foto) dhe nje patente qe e keni pasur per te pakten 2 vjet. Patatentat e BE, UK, US, CA, AU, NZ, JP, CH pranohen direkt. Patatentat e tjera kane nevoje per Leje Nderkombetare Drejtimi. Ne fotografimojme dokumentet ne marrje; kopjet ruhen per 12 muaj dhe me pas fshihen.",
      "Excellent service! The car was spotless and the pickup at Tirana Airport was smooth. Will use DriveNow again.": "Sherbim i shkelqyer! Makina ishte e paster dhe marrja ne Aeroportin e Tiranex kaloi pa probleme. Do te perdor serish DriveNow.",
      "Great value for money. The Duster was perfect for exploring the Albanian Riviera. Highly recommend!": "Vlere e shkelqyer per parate. Duster ishte perfekt per te eksploruar Riviera Shqiptare. E rekomandoj me force!",
      "Very transparent pricing with no hidden fees. Cash payment made everything simple. Good experience overall.": "Cmime shum transparente pa tarifa te fshehura. Pagesa ne cash e beri gjithcka te thjeshte. Pervoje e mire nepergeth.",
      "day": "dite"
    },
    it: {
      "Last updated: June 9, 2026": "Ultimo aggiornamento: 9 giugno 2026",
      "Demo notice:": "Avviso demo:",
      "Who We Are": "Chi siamo",
      "Current Website Status": "Stato attuale del sito",
      "Personal Data We May Collect": "Dati personali che possiamo raccogliere",
      "How We Use Data": "Come usiamo i dati",
      "Third-Party Services": "Servizi di terze parti",
      "Cookies And Local Storage": "Cookie e archiviazione locale",
      "Data Retention": "Conservazione dei dati",
      "Your Rights": "I tuoi diritti",
      "Website Status": "Stato del sito",
      "No Real Bookings": "Nessuna prenotazione reale",
      "No Price Or Availability Guarantee": "Nessuna garanzia di prezzo o disponibilita",
      "Future Rental Terms Placeholder": "Termini futuri di noleggio",
      "User Responsibilities": "Responsabilita dell'utente",
      "Limitation Of Liability": "Limitazione di responsabilita",
      "Questions about these terms can be sent to": "Le domande su questi termini possono essere inviate a",
      "this website is currently for demonstration and testing only. Booking requests submitted through this website are not real reservations and do not create a rental contract.": "questo sito e attualmente solo per dimostrazione e test. Le richieste di prenotazione inviate tramite questo sito non sono prenotazioni reali e non creano un contratto di noleggio.",
      "this website is currently for demonstration and testing only. Booking requests are not real reservations, do not guarantee vehicle availability, and do not create a rental contract.": "questo sito e attualmente solo per dimostrazione e test. Le richieste di prenotazione non sono prenotazioni reali, non garantiscono la disponibilita del veicolo e non creano un contratto di noleggio.",
      "Dua Makina is an Albania-based car rental website concept. You can contact us at": "Dua Makina e un concept di sito di autonoleggio con base in Albania. Puoi contattarci a",
      "The website may use local storage or similar browser storage for selected language, currency, booking search details, cached vehicle data, and inquiry cooldown checks. Third-party services may use cookies or equivalent technologies for security, analytics, or delivery.": "Il sito puo usare local storage o archiviazione simile del browser per lingua, valuta, dettagli di ricerca, dati dei veicoli in cache e controlli anti-abuso. I servizi di terze parti possono usare cookie o tecnologie equivalenti per sicurezza, analisi o distribuzione.",
      "car transmission": "Cambio dell'auto",
      "Insurance type": "Tipo di assicurazione",
      "Car year": "Anno dell'auto",
      "car seats": "Posti dell'auto",
      "car trunk capacity": "Capacita del bagagliaio",
      "car doors": "Porte dell'auto",
      "A/C": "Climatizzatore",
      "car fuel type": "Tipo di carburante",
      "Ferry travel to Greece (Saranda-Corfu) and Italy (Durres-Bari) is allowed with prior notice. Please inform us when booking.": "I viaggi in traghetto verso la Grecia (Saranda-Corfu) e l'Italia (Durazzo-Bari) sono consentiti con preavviso. Vi preghiamo di informarci al momento della prenotazione.",
      "No card hold ·": "Nessun blocco carta ·",
      "We never take a card hold.": "Non blocchiamo mai la carta.",
      "A small": "Una piccola",
      "cash deposit is collected at pickup, returned at drop-off": "di deposito in contanti viene ritirato al ritiro e restituito alla riconsegna",
      ". The full rental is also paid in cash on collection — EUR, USD, LEK, or GBP.": ". Il noleggio completo viene anch'esso pagato in contanti al ritiro — EUR, USD, LEK o GBP.",
      "Min age": "Eta min.",
      "Max age 75": "Eta max 75",
      "2+ years license": "Patente 2+ anni",
      "The named driver must be present at pickup. Additional drivers (max 2) must also be present and add": "Il conducente indicato deve essere presente al ritiro. Anche i conducenti aggiuntivi (max 2) devono essere presenti e aggiungere",
      "/day each. Young driver surcharge of": "/giorno ciascuno. Soprattassa per conducente giovane di",
      "/day applies between ages 21-22.": "/giorno si applica tra le eta 21-22.",
      "Free up to 48h before · 50% within 48h · No-show forfeits": "Gratis fino a 48h prima · 50% entro 48h · No-show: perdita",
      "Cancel via email or by WhatsApp. Inside 48h we keep": "Cancella via email o WhatsApp. Entro 48h tratteniamo",
      "admin fee or 50% of the rental, whichever is lower. Schedule changes up to 6h before pickup are free.": "commissione amministrativa o 50% del noleggio, qualunque sia inferiore. Le modifiche di orario fino a 6h prima del ritiro sono gratuite.",
      "Bring your original passport (not just a photo) and a driving license held for at least 2 years. EU, UK, US, CA, AU, NZ, JP, CH licenses are accepted directly. Other licenses need an International Driving Permit. We photograph documents at pickup; copies are stored for 12 months and then deleted.": "Porta il passaporto originale (non solo una foto) e una patente posseduta da almeno 2 anni. Le patenti di UE, UK, US, CA, AU, NZ, JP, CH sono accettate direttamente. Altre patenti richiedono un Permesso Internazionale di Guida. Fotografiamo i documenti al ritiro; le copie vengono conservate per 12 mesi e poi cancellate.",
      "Excellent service! The car was spotless and the pickup at Tirana Airport was smooth. Will use DriveNow again.": "Servizio eccellente! L'auto era pulitissima e il ritiro all'Aeroporto di Tirana e stato senza problemi. Usero DriveNow di nuovo.",
      "Great value for money. The Duster was perfect for exploring the Albanian Riviera. Highly recommend!": "Ottimo rapporto qualita-prezzo. Il Duster era perfetto per esplorare la Riviera Albanese. Altamente raccomandato!",
      "Very transparent pricing with no hidden fees. Cash payment made everything simple. Good experience overall.": "Prezzi molto trasparenti senza costi nascosti. Il pagamento in contanti ha reso tutto semplice. Buona esperienza generale.",
      "day": "giorno"
    },
    fr: {
      "Last updated: June 9, 2026": "Derniere mise a jour : 9 juin 2026",
      "Demo notice:": "Avis de demonstration :",
      "Who We Are": "Qui nous sommes",
      "Current Website Status": "Statut actuel du site",
      "Personal Data We May Collect": "Donnees personnelles que nous pouvons collecter",
      "How We Use Data": "Comment nous utilisons les donnees",
      "Third-Party Services": "Services tiers",
      "Cookies And Local Storage": "Cookies et stockage local",
      "Data Retention": "Conservation des donnees",
      "Your Rights": "Vos droits",
      "Website Status": "Statut du site",
      "No Real Bookings": "Aucune reservation reelle",
      "No Price Or Availability Guarantee": "Aucune garantie de prix ou de disponibilite",
      "Future Rental Terms Placeholder": "Futures conditions de location",
      "User Responsibilities": "Responsabilites de l'utilisateur",
      "Limitation Of Liability": "Limitation de responsabilite",
      "Questions about these terms can be sent to": "Les questions sur ces conditions peuvent etre envoyees a",
      "car transmission": "Transmission de la voiture",
      "Insurance type": "Type d'assurance",
      "Car year": "Annee de la voiture",
      "car seats": "Sieges de la voiture",
      "car trunk capacity": "Capacite du coffre",
      "car doors": "Portieres de la voiture",
      "A/C": "Climatisation",
      "car fuel type": "Type de carburant",
      "Ferry travel to Greece (Saranda-Corfu) and Italy (Durres-Bari) is allowed with prior notice. Please inform us when booking.": "Les voyages en ferry vers la Grece (Saranda-Corfu) et l'Italie (Durres-Bari) sont autorises avec preavis. Veuillez nous informer lors de la reservation.",
      "No card hold ·": "Aucun blocage carte ·",
      "We never take a card hold.": "Nous ne bloquons jamais de carte.",
      "A small": "Un petit",
      "cash deposit is collected at pickup, returned at drop-off": "de depot en especes est percu a la prise en charge, restitue au retour",
      ". The full rental is also paid in cash on collection — EUR, USD, LEK, or GBP.": ". La location complete est egalement payee en especes a la prise en charge — EUR, USD, LEK ou GBP.",
      "Min age": "Age min.",
      "Max age 75": "Age max 75",
      "2+ years license": "Permis 2+ ans",
      "The named driver must be present at pickup. Additional drivers (max 2) must also be present and add": "Le conducteur designe doit etre present a la prise en charge. Les conducteurs supplementaires (max 2) doivent egalement etre presents et ajouter",
      "/day each. Young driver surcharge of": "/jour chacun. Surcharge pour jeune conducteur de",
      "/day applies between ages 21-22.": "/jour s'applique entre 21 et 22 ans.",
      "Free up to 48h before · 50% within 48h · No-show forfeits": "Gratuit jusqu'a 48h avant · 50% dans les 48h · No-show = perte",
      "Cancel via email or by WhatsApp. Inside 48h we keep": "Annulez par email ou WhatsApp. Dans les 48h nous retenons",
      "admin fee or 50% of the rental, whichever is lower. Schedule changes up to 6h before pickup are free.": "frais administratifs ou 50% de la location, selon le montant le plus bas. Les changements d'horaire jusqu'a 6h avant la prise en charge sont gratuits.",
      "Bring your original passport (not just a photo) and a driving license held for at least 2 years. EU, UK, US, CA, AU, NZ, JP, CH licenses are accepted directly. Other licenses need an International Driving Permit. We photograph documents at pickup; copies are stored for 12 months and then deleted.": "Apportez votre passeport original (pas seulement une photo) et un permis de conduire detenu depuis au moins 2 ans. Les permis UE, UK, US, CA, AU, NZ, JP, CH sont acceptes directement. Les autres permis necessitent un Permis de Conduire International. Nous photographions les documents a la prise en charge ; les copies sont conservees 12 mois puis supprimees.",
      "Excellent service! The car was spotless and the pickup at Tirana Airport was smooth. Will use DriveNow again.": "Service excellent ! La voiture etait impeccable et la prise en charge a l'aeroport de Tirana s'est faite sans probleme. J'utiliserai DriveNow a nouveau.",
      "Great value for money. The Duster was perfect for exploring the Albanian Riviera. Highly recommend!": "Excellent rapport qualite-prix. Le Duster etait parfait pour explorer la Riviera albanaise. Hautement recommande !",
      "Very transparent pricing with no hidden fees. Cash payment made everything simple. Good experience overall.": "Tarification tres transparente sans frais caches. Le paiement en especes a rendu tout simple. Bonne experience globale.",
      "day": "jour"
    },
    de: {
      "Last updated: June 9, 2026": "Zuletzt aktualisiert: 9. Juni 2026",
      "Demo notice:": "Demo-Hinweis:",
      "Who We Are": "Wer wir sind",
      "Current Website Status": "Aktueller Website-Status",
      "Personal Data We May Collect": "Personenbezogene Daten, die wir erheben koennen",
      "How We Use Data": "Wie wir Daten verwenden",
      "Third-Party Services": "Dienste von Drittanbietern",
      "Cookies And Local Storage": "Cookies und lokaler Speicher",
      "Data Retention": "Datenspeicherung",
      "Your Rights": "Ihre Rechte",
      "Website Status": "Website-Status",
      "No Real Bookings": "Keine echten Buchungen",
      "No Price Or Availability Guarantee": "Keine Preis- oder Verfuegbarkeitsgarantie",
      "Future Rental Terms Placeholder": "Zukuenftige Mietbedingungen",
      "User Responsibilities": "Verantwortlichkeiten des Nutzers",
      "Limitation Of Liability": "Haftungsbeschraenkung",
      "Questions about these terms can be sent to": "Fragen zu diesen Bedingungen koennen gesendet werden an",
      "car transmission": "Getriebe des Autos",
      "Insurance type": "Versicherungsart",
      "Car year": "Baujahr des Autos",
      "car seats": "Sitze des Autos",
      "car trunk capacity": "Kofferraumkapazitaet",
      "car doors": "Tueren des Autos",
      "A/C": "Klimaanlage",
      "car fuel type": "Kraftstoffart",
      "Ferry travel to Greece (Saranda-Corfu) and Italy (Durres-Bari) is allowed with prior notice. Please inform us when booking.": "Faehreisen nach Griechenland (Saranda-Korfu) und Italien (Durres-Bari) sind bei vorheriger Ankuendigung erlaubt. Bitte informieren Sie uns bei der Buchung.",
      "No card hold ·": "Keine Kartensperre ·",
      "We never take a card hold.": "Wir sperren nie eine Karte.",
      "A small": "Eine kleine",
      "cash deposit is collected at pickup, returned at drop-off": "Bargeldkaution wird bei Abholung erhoben, bei Rueckgabe zurueckerstattet",
      ". The full rental is also paid in cash on collection — EUR, USD, LEK, or GBP.": ". Die volle Miete wird ebenfalls in bar bei der Abholung bezahlt — EUR, USD, LEK oder GBP.",
      "Min age": "Min. Alter",
      "Max age 75": "Max. Alter 75",
      "2+ years license": "2+ Jahre Fuehrerschein",
      "The named driver must be present at pickup. Additional drivers (max 2) must also be present and add": "Der genannte Fahrer muss bei der Abholung anwesend sein. Zusaetzliche Fahrer (max. 2) muessen ebenfalls anwesend sein und",
      "/day each. Young driver surcharge of": "/Tag jeweils. Junge-Fahrer-Zuschlag von",
      "/day applies between ages 21-22.": "/Tag gilt fuer Alter 21-22.",
      "Free up to 48h before · 50% within 48h · No-show forfeits": "Kostenlos bis 48h vorher · 50% innerhalb 48h · Nichterscheinen = Verlust",
      "Cancel via email or by WhatsApp. Inside 48h we keep": "Stornieren Sie per E-Mail oder WhatsApp. Innerhalb von 48h behalten wir",
      "admin fee or 50% of the rental, whichever is lower. Schedule changes up to 6h before pickup are free.": "Verwaltungsgebuehr oder 50% der Miete, je nachdem, was niedriger ist. Zeitplananderungen bis zu 6h vor der Abholung sind kostenlos.",
      "Bring your original passport (not just a photo) and a driving license held for at least 2 years. EU, UK, US, CA, AU, NZ, JP, CH licenses are accepted directly. Other licenses need an International Driving Permit. We photograph documents at pickup; copies are stored for 12 months and then deleted.": "Bringen Sie Ihren Original-Pass (nicht nur ein Foto) und einen seit mindestens 2 Jahren gehaltenen Fuehrerschein mit. Fuehrerscheine aus EU, UK, US, CA, AU, NZ, JP, CH werden direkt akzeptiert. Andere Fuehrerscheine benoetigen einen Internationalen Fuehrerschein. Wir fotografieren Dokumente bei der Abholung; Kopien werden 12 Monate aufbewahrt und dann geloescht.",
      "Excellent service! The car was spotless and the pickup at Tirana Airport was smooth. Will use DriveNow again.": "Ausgezeichneter Service! Das Auto war makellos und die Abholung am Flughafen Tirana verlief reibungslos. Werde DriveNow wieder nutzen.",
      "Great value for money. The Duster was perfect for exploring the Albanian Riviera. Highly recommend!": "Hervorragendes Preis-Leistungs-Verhaeltnis. Der Duster war perfekt, um die albanische Riviera zu erkunden. Sehr zu empfehlen!",
      "Very transparent pricing with no hidden fees. Cash payment made everything simple. Good experience overall.": "Sehr transparente Preisgestaltung ohne versteckte Gebuehren. Die Barzahlung hat alles einfach gemacht. Insgesamt gute Erfahrung.",
      "day": "Tag"
    }
  };

  Object.entries(extraTranslations).forEach(([lang, entries]) => {
    Object.assign(phraseMap[lang], entries);
  });

  const valueMap = {
    category: {
      sq: { economy: "Ekonomike", compact: "Kompakte", sedan: "Sedan", suv: "SUV", luxury: "Luksoze", van: "Furgon", minivan: "Minivan", coupe: "Kupe", convertible: "Kabriolet", pickup: "Pickup" },
      it: { economy: "Economica", compact: "Compatta", sedan: "Berlina", suv: "SUV", luxury: "Lusso", van: "Van", minivan: "Minivan", coupe: "Coupe", convertible: "Cabriolet", pickup: "Pickup" },
      fr: { economy: "Economique", compact: "Compacte", sedan: "Berline", suv: "SUV", luxury: "Luxe", van: "Van", minivan: "Monospace", coupe: "Coupe", convertible: "Cabriolet", pickup: "Pickup" },
      de: { economy: "Economy", compact: "Kompakt", sedan: "Limousine", suv: "SUV", luxury: "Luxus", van: "Van", minivan: "Minivan", coupe: "Coupe", convertible: "Cabrio", pickup: "Pickup" }
    },
    fuel: {
      sq: { gasoline: "Benzine", diesel: "Dizel", electric: "Elektrike", hybrid: "Hibride", "plug-in hybrid": "Hibride plug-in", lpg: "LPG" },
      it: { gasoline: "Benzina", diesel: "Diesel", electric: "Elettrica", hybrid: "Ibrida", "plug-in hybrid": "Ibrida plug-in", lpg: "GPL" },
      fr: { gasoline: "Essence", diesel: "Diesel", electric: "Electrique", hybrid: "Hybride", "plug-in hybrid": "Hybride rechargeable", lpg: "GPL" },
      de: { gasoline: "Benzin", diesel: "Diesel", electric: "Elektrisch", hybrid: "Hybrid", "plug-in hybrid": "Plug-in-Hybrid", lpg: "Autogas" }
    },
    transmission: {
      sq: { automatic: "Automatike", manual: "Manuale" },
      it: { automatic: "Automatico", manual: "Manuale" },
      fr: { automatic: "Automatique", manual: "Manuelle" },
      de: { automatic: "Automatik", manual: "Manuell" }
    },
    insurance: {
      sq: { basic: "Baze", premium: "Premium", full: "Premium", "third-party": "Baze", none: "Pa sigurim" },
      it: { basic: "Base", premium: "Premium", full: "Premium", "third-party": "Base", none: "Nessuna assicurazione" },
      fr: { basic: "Base", premium: "Premium", full: "Premium", "third-party": "Base", none: "Aucune assurance" },
      de: { basic: "Basis", premium: "Premium", full: "Premium", "third-party": "Basis", none: "Keine Versicherung" }
    },
    extra: {
      sq: {
        "baby-seat": "Ulëse foshnje",
        "booster-seat": "Ulëse ngritëse",
        "child-seat": "Ulëse për fëmijë",
        "wifi": "WiFi",
        "gps": "GPS",
        "navigation": "Navigim",
        "navigation-system": "Sistem navigimi",
        "additional-driver": "Shofer shtesë",
        "driver-plus": "Shofer shtesë",
        "insurance": "Sigurim",
        "insurance-booking": "Sigurim",
        "snow-chains": "Zinxhë dëbore",
        "roof-box": "Kuti çatie",
        "bike-rack": "Mbajtëse biçikletash",
        "coolbox": "Kuti ftohëse",
        "fridge": "Frigorifer",
        "tent": "Tendë",
        "camping": "Kampim",
        "phone-mount": "Mbajtëse telefoni",
        "usb-charger": "Karikues USB",
        "baby-seat-desc": "Ulëse sigurie për foshnje (0-13 kg)",
        "booster-seat-desc": "Ulëse ngritëse për fëmijë (4-12 vjeç)",
        "child-seat-desc": "Ulëse sigurie për fëmijë (9-36 kg)",
        "wifi-desc": "Hotspot WiFi 4G i pakufizuar në makinë",
        "gps-desc": "Sistem navigimi GPS me harta lokale",
        "navigation-desc": "Sistem navigimi GPS me harta lokale",
        "navigation-system-desc": "GPS i integruar me udhëzime me zë",
        "additional-driver-desc": "Regjistro një shofer shtesë për qiraja",
        "driver-plus-desc": "Regjistro një shofer shtesë për qiraja",
        "insurance-desc": "Mbulim shtesë sigurimi për qetësi",
        "insurance-booking-desc": "Mbulim shtesë sigurimi për qetësi",
        "snow-chains-desc": "Zinxhë dëbore për kushte dimri",
        "roof-box-desc": "Kuti çatie për hapësirë shtesë bagazhi",
        "bike-rack-desc": "Mbajtëse biçikletash për deri në 3 biçikleta",
        "coolbox-desc": "Kuti ftohëse portative për ushqim dhe pije",
        "fridge-desc": "Frigorifer 12V i integruar",
        "tent-desc": "Tendë kampimi e përfshirë",
        "camping-desc": "Paketë pajisjesh kampimi",
        "phone-mount-desc": "Mbajtëse telefoni për navigim",
        "usb-charger-desc": "Porta shtesë karikimi USB"
      },
      it: {
        "baby-seat": "Seggiolino neonati",
        "booster-seat": "Rialzo",
        "child-seat": "Seggiolino bambini",
        "wifi": "WiFi",
        "gps": "GPS",
        "navigation": "Navigazione",
        "navigation-system": "Sistema di navigazione",
        "additional-driver": "Autista aggiuntivo",
        "driver-plus": "Autista aggiuntivo",
        "insurance": "Assicurazione",
        "insurance-booking": "Assicurazione",
        "snow-chains": "Catene da neve",
        "roof-box": "Box portatutto",
        "bike-rack": "Portabici",
        "coolbox": "Borsa termica",
        "fridge": "Frigorifero",
        "tent": "Tenda",
        "camping": "Camping",
        "phone-mount": "Supporto telefono",
        "usb-charger": "Caricatore USB",
        "baby-seat-desc": "Seggiolino di sicurezza per neonati (0-13 kg)",
        "booster-seat-desc": "Rialzo per bambini (4-12 anni)",
        "child-seat-desc": "Seggiolino di sicurezza per bambini (9-36 kg)",
        "wifi-desc": "Hotspot WiFi 4G illimitato in auto",
        "gps-desc": "Sistema di navigazione GPS con mappe locali",
        "navigation-desc": "Sistema di navigazione GPS con mappe locali",
        "navigation-system-desc": "GPS integrato con indicazioni vocali",
        "additional-driver-desc": "Registra un autista aggiuntivo per il noleggio",
        "driver-plus-desc": "Registra un autista aggiuntivo per il noleggio",
        "insurance-desc": "Copertura assicurativa aggiuntiva per tranquillita",
        "insurance-booking-desc": "Copertura assicurativa aggiuntiva per tranquillita",
        "snow-chains-desc": "Catene da neve per condizioni invernali",
        "roof-box-desc": "Box portatutto per spazio extra bagagli",
        "bike-rack-desc": "Portabici per fino a 3 biciclette",
        "coolbox-desc": "Borsa termica portatile per cibo e bevande",
        "fridge-desc": "Frigorifero 12V integrato",
        "tent-desc": "Tenda da campeggio inclusa",
        "camping-desc": "Set attrezzatura da campeggio",
        "phone-mount-desc": "Supporto telefono per navigazione",
        "usb-charger-desc": "Porte di ricarica USB aggiuntive"
      },
      fr: {
        "baby-seat": "Siege bebe",
        "booster-seat": "Rehausseur",
        "child-seat": "Siege enfant",
        "wifi": "WiFi",
        "gps": "GPS",
        "navigation": "Navigation",
        "navigation-system": "Systeme de navigation",
        "additional-driver": "Conducteur supplementaire",
        "driver-plus": "Conducteur supplementaire",
        "insurance": "Assurance",
        "insurance-booking": "Assurance",
        "snow-chains": "Chaines a neige",
        "roof-box": "Coffre de toit",
        "bike-rack": "Porte-velos",
        "coolbox": "Glaceire",
        "fridge": "Refrigerateur",
        "tent": "Tente",
        "camping": "Camping",
        "phone-mount": "Support telephone",
        "usb-charger": "Chargeur USB",
        "baby-seat-desc": "Siege de securite pour bebes (0-13 kg)",
        "booster-seat-desc": "Rehausseur pour enfants (4-12 ans)",
        "child-seat-desc": "Siege de securite pour enfants (9-36 kg)",
        "wifi-desc": "Hotspot WiFi 4G illimite dans la voiture",
        "gps-desc": "Systeme de navigation GPS avec cartes locales",
        "navigation-desc": "Systeme de navigation GPS avec cartes locales",
        "navigation-system-desc": "GPS integre avec instructions vocales",
        "additional-driver-desc": "Enregistrer un conducteur supplementaire",
        "driver-plus-desc": "Enregistrer un conducteur supplementaire",
        "insurance-desc": "Couverture d'assurance supplementaire",
        "insurance-booking-desc": "Couverture d'assurance supplementaire",
        "snow-chains-desc": "Chaines a neige pour conditions hivernales",
        "roof-box-desc": "Coffre de toit pour bagages supplementaires",
        "bike-rack-desc": "Porte-velos pour jusqu'a 3 velos",
        "coolbox-desc": "Glaceire portative pour nourriture et boissons",
        "fridge-desc": "Refrigerateur 12V integre",
        "tent-desc": "Tente de camping incluse",
        "camping-desc": "Pack d'equipement de camping",
        "phone-mount-desc": "Support telephone pour navigation",
        "usb-charger-desc": "Ports de charge USB supplementaires"
      },
      de: {
        "baby-seat": "Babysitz",
        "booster-seat": "Sitzerhoehung",
        "child-seat": "Kindersitz",
        "wifi": "WLAN",
        "gps": "GPS",
        "navigation": "Navigation",
        "navigation-system": "Navigationssystem",
        "additional-driver": "Zusaetzlicher Fahrer",
        "driver-plus": "Zusaetzlicher Fahrer",
        "insurance": "Versicherung",
        "insurance-booking": "Versicherung",
        "snow-chains": "Schneeketten",
        "roof-box": "Dachbox",
        "bike-rack": "Fahrradtraeger",
        "coolbox": "Kuehlbox",
        "fridge": "Kuehlschrank",
        "tent": "Zelt",
        "camping": "Camping",
        "phone-mount": "Handyhalterung",
        "usb-charger": "USB-Ladegeraet",
        "baby-seat-desc": "Sicherheitssitz fuer Babys (0-13 kg)",
        "booster-seat-desc": "Sitzerhoehung fuer Kinder (4-12 Jahre)",
        "child-seat-desc": "Sicherheitssitz fuer Kinder (9-36 kg)",
        "wifi-desc": "Unbegrenzter 4G-WLAN-Hotspot im Auto",
        "gps-desc": "GPS-Navigationssystem mit lokalen Karten",
        "navigation-desc": "GPS-Navigationssystem mit lokalen Karten",
        "navigation-system-desc": "Integriertes GPS mit Sprachausgabe",
        "additional-driver-desc": "Zusaetzlichen Fahrer registrieren",
        "driver-plus-desc": "Zusaetzlichen Fahrer registrieren",
        "insurance-desc": "Zusaetzliche Versicherungsdeckung",
        "insurance-booking-desc": "Zusaetzliche Versicherungsdeckung",
        "snow-chains-desc": "Schneeketten fuer winterliche Bedingungen",
        "roof-box-desc": "Dachbox fuer zusaetzlichen Gepaeckplatz",
        "bike-rack-desc": "Fahrradtraeger fuer bis zu 3 Fahrraeder",
        "coolbox-desc": "Tragbare Kuehlbox fuer Essen und Getraenke",
        "fridge-desc": "Integrierter 12V-Kuehlschrank",
        "tent-desc": "Campingzelt inklusive",
        "camping-desc": "Campingausruestungs-Set",
        "phone-mount-desc": "Handyhalterung fuer Navigation",
        "usb-charger-desc": "Zusaetzliche USB-Ladeanschluesse"
      }
    },
    country: {
      sq: { al: "Shqipëria", gr: "Greqia", it: "Italia", mk: "Maqedonia e Veriut", me: "Mali i Zi", rs: "Serbia", xk: "Kosova", bg: "Bullgaria", tr: "Turqia", de: "Gjermania", si: "Sllovenia", hr: "Kroacia", at: "Austria", fr: "Franca", es: "Spanja", gb: "Britania e Madhe", us: "SHBA", nl: "Holanda", be: "Belgjika", ch: "Zvicrra" },
      it: { al: "Albania", gr: "Grecia", it: "Italia", mk: "Macedonia del Nord", me: "Montenegro", rs: "Serbia", xk: "Kosovo", bg: "Bulgaria", tr: "Turchia", de: "Germania", si: "Slovenia", hr: "Croazia", at: "Austria", fr: "Francia", es: "Spagna", gb: "Regno Unito", us: "Stati Uniti", nl: "Paesi Bassi", be: "Belgio", ch: "Svizzera" },
      fr: { al: "Albanie", gr: "Grece", it: "Italie", mk: "Macedoine du Nord", me: "Montenegro", rs: "Serbie", xk: "Kosovo", bg: "Bulgarie", tr: "Turquie", de: "Allemagne", si: "Slovenie", hr: "Croatie", at: "Autriche", fr: "France", es: "Espagne", gb: "Royaume-Uni", us: "Etats-Unis", nl: "Pays-Bas", be: "Belgique", ch: "Suisse" },
      de: { al: "Albanien", gr: "Griechenland", it: "Italien", mk: "Nordmazedonien", me: "Montenegro", rs: "Serbien", xk: "Kosovo", bg: "Bulgarien", tr: "Tuerkei", de: "Deutschland", si: "Slowenien", hr: "Kroatien", at: "Oesterreich", fr: "Frankreich", es: "Spanien", gb: "Grossbritannien", us: "USA", nl: "Niederlande", be: "Belgien", ch: "Schweiz" }
    }
  };

  // Slug aliases: DB slugs that differ from the valueMap.extra keys.
  // Maps alias → canonical key already present in valueMap.extra.
  // Also auto-creates the corresponding "-desc" alias.
  const EXTRA_SLUG_ALIASES = {
    "wifi-hotspot":       "wifi",
    "wifi_hotspot":       "wifi",
    "insurance-upgrade":  "insurance-booking",
    "insurance_upgrade":  "insurance-booking",
  };

  SUPPORTED_LANGS
    .filter((l) => l !== DEFAULT_LANG)
    .forEach((lang) => {
      const extrasForLang = valueMap.extra[lang];
      if (!extrasForLang) return;
      Object.entries(EXTRA_SLUG_ALIASES).forEach(([alias, canonical]) => {
        if (extrasForLang[canonical] && !extrasForLang[alias]) {
          extrasForLang[alias] = extrasForLang[canonical];
        }
        const descAlias = alias + "-desc";
        const descCanonical = canonical + "-desc";
        if (extrasForLang[descCanonical] && !extrasForLang[descAlias]) {
          extrasForLang[descAlias] = extrasForLang[descCanonical];
        }
      });
    });

  const pluralMap = {
    sq: { seats: ["Vend", "Vende"], bags: ["Cante", "Canta"], doors: ["Dere", "Dyer"], days: ["dite", "dite"] },
    it: { seats: ["Posto", "Posti"], bags: ["Bagaglio", "Bagagli"], doors: ["Porta", "Porte"], days: ["giorno", "giorni"] },
    fr: { seats: ["Place", "Places"], bags: ["Bagage", "Bagages"], doors: ["Porte", "Portes"], days: ["jour", "jours"] },
    de: { seats: ["Sitz", "Sitze"], bags: ["Gepaeckstueck", "Gepaeckstuecke"], doors: ["Tuer", "Tueren"], days: ["Tag", "Tage"] }
  };

  function buildDerivedMap(lang) {
    const derived = { ...phraseMap.it };
    const replacements = fromItalian[lang] || {};
    Object.entries(derived).forEach(([english, italian]) => {
      if (replacements[italian]) derived[english] = replacements[italian];
    });
    if (lang === "fr") {
      derived.English = "Anglais";
      derived.Albanian = "Albanais";
      derived.French = "Francais";
      derived.Italian = "Italien";
      derived.German = "Allemand";
    }
    if (lang === "de") {
      derived.English = "Englisch";
      derived.Albanian = "Albanisch";
      derived.French = "Franzoesisch";
      derived.Italian = "Italienisch";
      derived.German = "Deutsch";
    }
    return derived;
  }

  function getInitialLang() {
    const stored = localStorage.getItem("lang");
    if (SUPPORTED_LANGS.includes(stored)) return stored;
    const pathLang = location.pathname.match(/^\/(sq|fr|it|de)(\/|$)/)?.[1];
    return SUPPORTED_LANGS.includes(pathLang) ? pathLang : DEFAULT_LANG;
  }

  let currentLang = getInitialLang();
  localStorage.setItem("lang", currentLang);

  function normalizeText(text) {
    return (text || "")
      .replace(/\u00a0/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function capitalize(value) {
    if (!value) return "";
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function t(key, params = {}) {
    const normalized = normalizeText(key);
    let translated = currentLang === DEFAULT_LANG ? normalized : (phraseMap[currentLang]?.[normalized] ?? normalized);
    Object.entries(params).forEach(([name, value]) => {
      translated = translated.replaceAll(`{${name}}`, value);
    });
    return translated;
  }

  function tv(domain, value) {
    if (value === null || value === undefined) return "";
    const normalized = value.toString().trim().toLowerCase();
    if (currentLang === DEFAULT_LANG) return capitalize(value.toString());
    return valueMap[domain]?.[currentLang]?.[normalized] ?? t(capitalize(value.toString()));
  }

  function plural(type, count) {
    if (currentLang === DEFAULT_LANG) {
      const labels = { seats: ["Seat", "Seats"], bags: ["Bag", "Bags"], doors: ["Door", "Doors"], days: ["day", "days"] };
      return `${count} ${Number(count) === 1 ? labels[type][0] : labels[type][1]}`;
    }
    const labels = pluralMap[currentLang]?.[type];
    if (!labels) return `${count}`;
    return `${count} ${Number(count) === 1 ? labels[0] : labels[1]}`;
  }

  function translateString(text) {
    if (currentLang === DEFAULT_LANG) return text;
    const trimmed = normalizeText(text);
    if (!trimmed || /^[\d\s:.,€$£L/%+-]+$/.test(trimmed)) return text;

    let translated = phraseMap[currentLang]?.[trimmed];

    // Handle text wrapped in quotation marks (e.g. review cards: "Some review text.")
    // The HTML stores the quote characters as part of the text node, so strip them,
    // look up the inner phrase, then re-wrap.
    if (!translated) {
      const first = trimmed[0];
      const last = trimmed[trimmed.length - 1];
      const isWrapped =
        (first === '"' && last === '"') ||
        (first === '\u201C' && last === '\u201D') ||
        (first === '\u2018' && last === '\u2019');
      if (isWrapped) {
        const inner = normalizeText(trimmed.slice(1, -1));
        const innerTranslated = phraseMap[currentLang]?.[inner];
        if (innerTranslated && innerTranslated !== inner) {
          translated = first + innerTranslated + last;
        }
      }
    }

    if (!translated) {
      translated = trimmed
        .replace(/\b(\d+)\s+Seats?\b/g, (_, n) => plural("seats", n))
        .replace(/\b(\d+)\s+Bags?\b/g, (_, n) => plural("bags", n))
        .replace(/\b(\d+)\s+Doors?\b/g, (_, n) => plural("doors", n))
        .replace(/\b(\d+)\s+days?\b/gi, (_, n) => plural("days", n))
        .replace(/\bper day\b/gi, t("per day"))
        .replace(/\bdays\b/gi, t("days"))
        .replace(/\bday\b/gi, t("day"));
    }

    if (translated === trimmed) return text;
    return text.replace(trimmed, translated);
  }

  const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME", "CANVAS"]);
  const originalTexts = new WeakMap();
  let observer = null;
  let translating = false;

  function translateNode(root = document.body) {
    if (!root || translating) return;
    translating = true;
    observer?.disconnect();

    try {
      document.documentElement.lang = currentLang;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.closest("[data-no-translate], .currency-num, .currency-sign, #carName, #carNamePrice, #car-name")) return NodeFilter.FILTER_REJECT;
          if (!normalizeText(node.nodeValue)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      });

      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach((node) => {
        if (!originalTexts.has(node)) originalTexts.set(node, node.nodeValue);
        const source = originalTexts.get(node);
        node.nodeValue = currentLang === DEFAULT_LANG ? source : translateString(source);
      });

      root.querySelectorAll?.("[placeholder], [aria-label], [title]").forEach((el) => {
        ["placeholder", "aria-label", "title"].forEach((attr) => {
          if (!el.hasAttribute(attr)) return;
          const sourceAttr = `data-i18n-${attr}-source`;
          if (!el.hasAttribute(sourceAttr)) el.setAttribute(sourceAttr, el.getAttribute(attr));
          const source = el.getAttribute(sourceAttr);
          el.setAttribute(attr, currentLang === DEFAULT_LANG ? source : translateString(source));
        });
      });

      syncSelect();
    } finally {
      translating = false;
      startObserver();
    }
  }

  function syncSelect() {
    const select = document.getElementById("langSelect");
    if (!select) return;
    select.value = currentLang;
    select.removeEventListener("change", handleLangChange);
    select.addEventListener("change", handleLangChange);
  }

  function handleLangChange(event) {
    setLang(event.target.value);
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) lang = DEFAULT_LANG;
    currentLang = lang;
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
    translateNode(document.body);
    window.dispatchEvent(new CustomEvent("languageChanged", { detail: { lang } }));
  }

  function startObserver() {
    if (!document.body) return;
    observer = observer || new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "characterData") originalTexts.delete(mutation.target);
      });
      if (translating || currentLang === DEFAULT_LANG) return;
      const shouldTranslate = mutations.some((mutation) => {
        if (mutation.type === "characterData") return true;
        return [...mutation.addedNodes].some((node) => node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE);
      });
      if (shouldTranslate) requestAnimationFrame(() => translateNode(document.body));
    });
    observer.observe(document.body, { childList: true, characterData: true, subtree: true });
  }

  function init() {
    if (!document.body) {
      document.addEventListener("DOMContentLoaded", init, { once: true });
      return;
    }
    syncSelect();
    translateNode(document.body);
  }

  window.DuaI18n = {
    ready: true,
    get lang() { return currentLang; },
    setLang,
    init,
    t,
    tv,
    plural,
    translatePage: () => translateNode(document.body),
    translateNode
  };

  window.addEventListener("partialsLoaded", init);
  document.addEventListener("DOMContentLoaded", init, { once: true });
  init();
})();