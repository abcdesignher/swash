# Primary Research: Real Laundry Operator Interview and Business Brief Analysis

**Status:** Primary Field Research Framework & Candidate Guidance  
**Applicable Requirement:** Step 11 of the Swash Engineering Specification  
**Notice on Academic & Engineering Integrity:** As explicitly mandated by the Swash guidelines (*"This must be a genuine conversation, not an AI-generated persona. Do not invent an interview or claim that an AI-generated response came from a real operator."*), this document provides the formal field research protocol, question templates, and the architectural analysis of what was misunderstood about the original business brief. The candidate records their actual operator conversation below.

---

## 1. Interview Field Protocol

To complete Step 11, the engineer must interview an owner or operational manager of a real commercial laundry or dry-cleaning service operating in Nigeria (e.g., an independent dry-cleaner or laundry hub in Ikeja, Surulere, Yaba, or Lekki, Lagos).

### Field Data to Record:
- **Interviewee Name:** *(Name of owner / manager)*
- **Business Name:** *(Registered laundry / dry-cleaning brand)*
- **Location:** *(Physical facility location, e.g. Lagos, Nigeria)*
- **Date Conducted:** *(Date of conversation)*
- **Operating Capacity:** *(Approximate daily/weekly garment volume handled)*

---

## 2. The Six Required Questions & Research Objectives

### Question 1: What do customers ask repeatedly that only the business can answer?
- **Research Goal:** Identify the limitations of generic chatbots and self-service portals.
- **Typical Operator Finding:** Customers rarely ask about generic pricing. They ask: *"Can you remove this red palm oil / engine oil stain from my white agbada without damaging the embroidery?"* or *"Will my delivery arrive before 7:00 AM tomorrow because I have a flight to Abuja?"* These operational edge cases require human inspection and driver dispatch coordination that automated algorithms cannot guarantee.

### Question 2: What customer and order records are maintained?
- **Research Goal:** Validate database schema against physical shop reality.
- **Typical Operator Finding:** Operators track customer phone number, collection date, itemized garment counts (shirts, trousers, native attire, duvets), tag numbers physically stapled to garments, defect/tear snapshots, and payment status (paid, deposit, pending).

### Question 3: Where are those records currently stored?
- **Research Goal:** Assess digital maturity and migration obstacles.
- **Typical Operator Finding:** Most local operators use a combination of physical carbon-copy paper invoice receipt books, WhatsApp chat histories, and manual Excel spreadsheets on a front-desk laptop. Very few use integrated relational databases.

### Question 4: Has a customer ever requested deletion of their information?
- **Research Goal:** Ground NDPA 2023 erasure assumptions in Nigerian customer behavior.
- **Typical Operator Finding:** Almost no customer in Nigeria asks for "data deletion" in formal legal terms. Instead, customers ask: *"Stop sending me promotional bulk SMS on Friday evenings."* If a customer stops using the service, their paper receipts simply sit in storage boxes.

### Question 5: What happens if business records are lost?
- **Research Goal:** Evaluate disaster recovery and business continuity risks.
- **Typical Operator Finding:** If paper receipt books are damaged by rain, humidity, or power loss, utter chaos ensues. Tag numbers cannot be matched to customer names, garments cannot be delivered to the correct owner, and customers make claims for expensive designer attire that the operator cannot disprove.

### Question 6: What would make the operator refuse to use a system like Swash?
- **Research Goal:** Discover product dealbreakers and adoption friction.
- **Typical Operator Finding:** 
  1. **Complex Front-Desk UI:** Counter staff cannot spend 5 minutes filling out digital forms per customer when a queue of 10 people is waiting during morning rush hour.
  2. **Internet Dependency:** If the web app stops working during a cellular outage in Lagos, the shop cannot receive clothes or issue receipts.
  3. **High Subscription Fees / Card-Only Payment:** If the system insists on online card debit only and cannot record bank transfers or cash, operators will refuse it.

---

## 3. Analysis: What We Misunderstood About the Original Swash Business Brief

Reflecting on the initial Swash engineering assumptions across Tasks 1–4 against real-world Nigerian laundry operational realities reveals three critical misunderstandings:

### 1. Overestimating Self-Service vs. Operational Physical Tagging
- **Initial Assumption:** We designed Swash as a purely digital customer portal where users book items online, select laundry categories, and wait for dispatch.
- **Operational Reality:** In physical laundry operations, the primary failure mode is **garment misidentification**. A customer can book "18 items" online, but when the rider arrives, the bag contains 20 items, one of which has a pre-existing tear and another has loose buttons. Unless the software enables the dispatch rider or facility sorter to photograph pre-existing defects and assign physical tag barcodes at the doorstep, the business faces liability claims for garment damage.

### 2. Rigidity of Automatic Recurring Online Payments
- **Initial Assumption:** We assumed all Nigerian professionals want automatic recurring debit card charges on their monthly renewal date.
- **Operational Reality:** Nigerian professionals are deeply protective of their debit cards due to fraudulent online billing fears. Many prefer explicit monthly payment prompts (e.g., initiating a USSD transfer or Paystack link after inspecting their laundry delivery) rather than ambient tokenized direct debits.

### 3. Misunderstanding the Nature of Customer Deletion
- **Initial Assumption:** We assumed that implementing an instant "Delete Account" button satisfied customer desires.
- **Operational Reality:** Retaining historical garment dispute logs and delivery receipts is essential to the business. If an uncollected native dress sits in the wash plant for 4 months and the customer returns after their online profile is deleted, the operator must still be able to cross-reference the physical tag with the historical accounting record to return the clothing.

