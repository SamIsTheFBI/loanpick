import "dotenv/config";
import { db } from "@/lib/db";
import { products } from "@/db/schema";
import { sql } from "drizzle-orm";

async function main() {
  console.log("Clearing existing products...");
  await db.execute(sql`DELETE FROM ${products}`);

  console.log("Seeding new products...");

  const seedProducts = [
    {
      name: "Swift Personal Loan",
      bank: "HDFC Bank",
      type: "personal",
      rate_apr: "11.5",
      min_income: "25000",
      min_credit_score: 700,
      tenure_min_months: 12,
      tenure_max_months: 60,
      processing_fee_pct: "2",
      prepayment_allowed: true,
      disbursal_speed: "fast",
      docs_level: "low",
      summary: "A flexible personal loan designed for quick access to funds with minimal documentation.",
      faq: [
        { question: "Is foreclosure allowed?", answer: "Yes, after 12 EMIs." },
        { question: "What is the processing fee?", answer: "2% of loan amount." }
      ],
      terms: {
        foreclosure_condition: "Allowed only after 12 months"
      }
    },
    {
      name: "Smart Home Loan",
      bank: "ICICI Bank",
      type: "home",
      rate_apr: "9.1",
      min_income: "35000",
      min_credit_score: 720,
      tenure_min_months: 60,
      tenure_max_months: 360,
      processing_fee_pct: "0.5",
      prepayment_allowed: true,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "A home loan offering lower EMIs with flexible tenure options.",
      faq: [
        { question: "Is insurance mandatory?", answer: "Recommended but not mandatory." }
      ],
      terms: {
        insurance_required: false
      }
    },
    {
      name: "DriveEasy Car Loan",
      bank: "State Bank of India",
      type: "vehicle",
      rate_apr: "8.5",
      min_income: "30000",
      min_credit_score: 690,
      tenure_min_months: 12,
      tenure_max_months: 84,
      processing_fee_pct: "1.2",
      prepayment_allowed: false,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "Affordable loan for new and pre-owned vehicles.",
      faq: [
        { question: "Are used cars allowed?", answer: "Yes, up to 5 years old." }
      ],
      terms: {}
    },
    {
      name: "Instant EduLoan",
      bank: "Axis Bank",
      type: "education",
      rate_apr: "10.2",
      min_income: "20000",
      min_credit_score: 680,
      tenure_min_months: 12,
      tenure_max_months: 84,
      processing_fee_pct: "1",
      prepayment_allowed: true,
      disbursal_speed: "fast",
      docs_level: "low",
      summary: "Designed for students pursuing higher education in India or abroad.",
      faq: [
        { question: "Is a co-applicant required?", answer: "Yes, if the student has no income." }
      ],
      terms: {}
    },
    {
      name: "Flexi Credit Line",
      bank: "Kotak Mahindra Bank",
      type: "credit_line",
      rate_apr: "14.5",
      min_income: "35000",
      min_credit_score: 710,
      tenure_min_months: 6,
      tenure_max_months: 48,
      processing_fee_pct: "1.5",
      prepayment_allowed: true,
      disbursal_speed: "instant",
      docs_level: "minimal",
      summary: "A revolving credit line for flexible withdrawals and repayments.",
      faq: [],
      terms: {}
    },
    {
      name: "Zero Fee Home Loan",
      bank: "Bank of Baroda",
      type: "home",
      rate_apr: "9.3",
      min_income: "40000",
      min_credit_score: 730,
      tenure_min_months: 60,
      tenure_max_months: 360,
      processing_fee_pct: "0",
      prepayment_allowed: true,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "A home loan with zero processing fees and long tenures.",
      faq: [],
      terms: {}
    },
    {
      name: "International Scholar Loan",
      bank: "YES Bank",
      type: "education",
      rate_apr: "11.8",
      min_income: "15000",
      min_credit_score: 650,
      tenure_min_months: 12,
      tenure_max_months: 120,
      processing_fee_pct: "1.25",
      prepayment_allowed: true,
      disbursal_speed: "fast",
      docs_level: "high",
      summary: "Education loan covering tuition and living expenses for international studies.",
      faq: [],
      terms: {}
    },
    {
      name: "QuickCash Personal Loan",
      bank: "IndusInd Bank",
      type: "personal",
      rate_apr: "12.75",
      min_income: "28000",
      min_credit_score: 700,
      tenure_min_months: 6,
      tenure_max_months: 48,
      processing_fee_pct: "2",
      prepayment_allowed: false,
      disbursal_speed: "instant",
      docs_level: "low",
      summary: "An instant approval loan ideal for small and urgent personal expenses.",
      faq: [],
      terms: {}
    },
    {
      name: "Debt Relief Consolidation Loan",
      bank: "Tata Capital",
      type: "debt_consolidation",
      rate_apr: "13.5",
      min_income: "30000",
      min_credit_score: 670,
      tenure_min_months: 12,
      tenure_max_months: 72,
      processing_fee_pct: "1.8",
      prepayment_allowed: true,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "Consolidate high-interest debts into a single affordable loan.",
      faq: [],
      terms: {}
    },
    {
      name: "Student Starter Loan",
      bank: "Punjab National Bank",
      type: "education",
      rate_apr: "9.9",
      min_income: "0",
      min_credit_score: 0,
      tenure_min_months: 24,
      tenure_max_months: 84,
      processing_fee_pct: "1",
      prepayment_allowed: true,
      disbursal_speed: "standard",
      docs_level: "standard",
      summary: "Special education loan for students with no income requirement.",
      faq: [],
      terms: {}
    }
  ];

  await db.insert(products).values(seedProducts);

  console.log("Seeding complete!");
}

main()
