--
-- PostgreSQL database dump
--

\restrict 3JDmbeCkzmhw4QAiV7LWHf3oHfEsLvDcWFgSap6EZ5PUsGn0MJ3oQg15pLEN6Vs

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_employees_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_employees_status AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'TERMINATED',
    'ON_LEAVE'
);


ALTER TYPE public.enum_employees_status OWNER TO postgres;

--
-- Name: enum_evaluation_periods_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_evaluation_periods_status AS ENUM (
    'DRAFT',
    'ACTIVE',
    'CLOSED'
);


ALTER TYPE public.enum_evaluation_periods_status OWNER TO postgres;

--
-- Name: enum_evaluations_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_evaluations_status AS ENUM (
    'IN_PROGRESS',
    'COMPLETED'
);


ALTER TYPE public.enum_evaluations_status OWNER TO postgres;

--
-- Name: enum_leaves_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_leaves_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED',
    'CANCELLED'
);


ALTER TYPE public.enum_leaves_status OWNER TO postgres;

--
-- Name: enum_payroll_items_item_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_payroll_items_item_type AS ENUM (
    'EARNING',
    'DEDUCTION',
    'EMPLOYER'
);


ALTER TYPE public.enum_payroll_items_item_type OWNER TO postgres;

--
-- Name: enum_payrolls_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_payrolls_status AS ENUM (
    'DRAFT',
    'CALCULATED',
    'APPROVED',
    'PAID'
);


ALTER TYPE public.enum_payrolls_status OWNER TO postgres;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'ADMIN',
    'HR_MANAGER',
    'EMPLOYEE',
    'FINANCE',
    'MANAGER'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.announcements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    content text,
    type character varying(20) DEFAULT 'GENERAL'::character varying NOT NULL,
    priority character varying(20) DEFAULT 'NORMAL'::character varying NOT NULL,
    published_by uuid,
    target_roles text DEFAULT ''::text,
    is_active boolean DEFAULT true NOT NULL,
    published_at timestamp with time zone,
    expires_at date,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.announcements OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid NOT NULL,
    user_id uuid,
    action character varying(50) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id uuid,
    old_values jsonb,
    new_values jsonb,
    ip_address character varying(45),
    created_at timestamp with time zone NOT NULL,
    module_name character varying(50),
    description text,
    user_agent text
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: criterion_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.criterion_scores (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    evaluation_id uuid NOT NULL,
    criterion_id uuid NOT NULL,
    score numeric(3,1),
    comment text,
    scored_by uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.criterion_scores OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    parent_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    code character varying(20),
    manager_id uuid
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: employee_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_documents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    document_type character varying(50) NOT NULL,
    title character varying(255) NOT NULL,
    file_data text,
    file_name character varying(255),
    file_size integer DEFAULT 0,
    uploaded_by uuid,
    expires_at date,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    notes text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.employee_documents OWNER TO postgres;

--
-- Name: employee_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_history (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    employee_id uuid NOT NULL,
    change_type character varying(50) NOT NULL,
    field_name character varying(100),
    old_value text,
    new_value text,
    changed_by uuid,
    notes text,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.employee_history OWNER TO postgres;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id uuid NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    national_id character varying(11) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(20),
    date_of_birth date NOT NULL,
    hire_date date NOT NULL,
    termination_date date,
    status public.enum_employees_status DEFAULT 'ACTIVE'::public.enum_employees_status NOT NULL,
    department_id uuid,
    position_id uuid,
    manager_id uuid,
    gross_salary numeric(12,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    employee_no character varying(20),
    work_type character varying(20) DEFAULT 'FULL_TIME'::character varying NOT NULL,
    gender character varying(10),
    address text,
    iban character varying(34),
    work_location character varying(20) DEFAULT 'OFFICE'::character varying,
    emergency_contact_name character varying(100),
    emergency_contact_phone character varying(20),
    photo text
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: evaluation_periods; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluation_periods (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    status public.enum_evaluation_periods_status DEFAULT 'DRAFT'::public.enum_evaluation_periods_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.evaluation_periods OWNER TO postgres;

--
-- Name: evaluations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluations (
    id uuid NOT NULL,
    employee_id uuid,
    period_id uuid,
    overall_score numeric(3,1),
    manager_comment text,
    status public.enum_evaluations_status DEFAULT 'IN_PROGRESS'::public.enum_evaluations_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    feedback text,
    employee_comment text,
    reviewer_id uuid,
    strengths text,
    improvement_areas text
);


ALTER TABLE public.evaluations OWNER TO postgres;

--
-- Name: goals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goals (
    id uuid NOT NULL,
    employee_id uuid,
    period_id uuid,
    title character varying(255) NOT NULL,
    description text,
    weight numeric(5,2) NOT NULL,
    self_score numeric(3,1),
    manager_score numeric(3,1),
    final_score numeric(3,1),
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.goals OWNER TO postgres;

--
-- Name: leave_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_balances (
    id uuid NOT NULL,
    employee_id uuid,
    leave_type_id uuid,
    year integer NOT NULL,
    total_days numeric(4,1) DEFAULT 14 NOT NULL,
    used_days numeric(4,1) DEFAULT 0 NOT NULL,
    remaining_days numeric(4,1) DEFAULT 14 NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.leave_balances OWNER TO postgres;

--
-- Name: leave_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_types (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    default_days integer DEFAULT 14 NOT NULL,
    is_paid boolean DEFAULT true NOT NULL,
    requires_approval boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.leave_types OWNER TO postgres;

--
-- Name: leaves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leaves (
    id uuid NOT NULL,
    employee_id uuid,
    leave_type_id uuid,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days numeric(4,1) NOT NULL,
    reason text,
    status public.enum_leaves_status DEFAULT 'PENDING'::public.enum_leaves_status NOT NULL,
    approved_by uuid,
    approved_at timestamp with time zone,
    rejection_reason text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    manager_approver_id uuid,
    hr_approver_id uuid,
    business_days integer,
    manager_approved_at timestamp with time zone,
    hr_approved_at timestamp with time zone
);


ALTER TABLE public.leaves OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    message text,
    type character varying(20) DEFAULT 'INFO'::character varying NOT NULL,
    module character varying(50),
    entity_type character varying(50),
    entity_id uuid,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: payroll_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payroll_items (
    id uuid NOT NULL,
    payroll_id uuid,
    item_type public.enum_payroll_items_item_type NOT NULL,
    item_name character varying(100) NOT NULL,
    amount numeric(12,2) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.payroll_items OWNER TO postgres;

--
-- Name: payroll_parameters; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payroll_parameters (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parameter_name character varying(100) NOT NULL,
    parameter_value numeric(10,5) NOT NULL,
    year integer NOT NULL,
    description text,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.payroll_parameters OWNER TO postgres;

--
-- Name: payrolls; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payrolls (
    id uuid NOT NULL,
    employee_id uuid,
    period_month integer NOT NULL,
    period_year integer NOT NULL,
    gross_salary numeric(12,2) DEFAULT 0 NOT NULL,
    net_salary numeric(12,2) DEFAULT 0 NOT NULL,
    total_deductions numeric(12,2) DEFAULT 0 NOT NULL,
    total_additions numeric(12,2) DEFAULT 0 NOT NULL,
    status public.enum_payrolls_status DEFAULT 'DRAFT'::public.enum_payrolls_status NOT NULL,
    calculated_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    bonus_payment numeric(12,2) DEFAULT 0 NOT NULL,
    overtime_payment numeric(12,2) DEFAULT 0 NOT NULL,
    transportation_allowance numeric(12,2) DEFAULT 0 NOT NULL,
    meal_allowance numeric(12,2) DEFAULT 0 NOT NULL,
    other_earnings numeric(12,2) DEFAULT 0 NOT NULL,
    total_gross_earnings numeric(12,2) DEFAULT 0 NOT NULL,
    employee_sgk_premium numeric(12,2) DEFAULT 0 NOT NULL,
    employee_unemployment_premium numeric(12,2) DEFAULT 0 NOT NULL,
    income_tax_base numeric(12,2) DEFAULT 0 NOT NULL,
    income_tax numeric(12,2) DEFAULT 0 NOT NULL,
    stamp_tax numeric(12,2) DEFAULT 0 NOT NULL,
    bes_deduction numeric(12,2) DEFAULT 0 NOT NULL,
    advance_deduction numeric(12,2) DEFAULT 0 NOT NULL,
    enforcement_deduction numeric(12,2) DEFAULT 0 NOT NULL,
    other_deductions numeric(12,2) DEFAULT 0 NOT NULL,
    employer_sgk_premium numeric(12,2) DEFAULT 0 NOT NULL,
    employer_unemployment_premium numeric(12,2) DEFAULT 0 NOT NULL,
    total_employer_cost numeric(12,2) DEFAULT 0 NOT NULL,
    approved_by uuid,
    approved_at timestamp with time zone
);


ALTER TABLE public.payrolls OWNER TO postgres;

--
-- Name: performance_criteria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.performance_criteria (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    weight numeric(5,2) DEFAULT 20 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.performance_criteria OWNER TO postgres;

--
-- Name: positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.positions (
    id uuid NOT NULL,
    title character varying(100) NOT NULL,
    level integer DEFAULT 1 NOT NULL,
    department_id uuid,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    description text,
    min_salary numeric(12,2) DEFAULT 0 NOT NULL,
    max_salary numeric(12,2) DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    position_code character varying(20),
    job_level character varying(20) DEFAULT 'SPECIALIST'::character varying
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    id uuid NOT NULL,
    user_id uuid,
    token text NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    revoked boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role public.enum_users_role NOT NULL,
    employee_id uuid,
    is_active boolean DEFAULT true NOT NULL,
    failed_login_attempts integer DEFAULT 0 NOT NULL,
    locked_until timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.announcements (id, title, content, type, priority, published_by, target_roles, is_active, published_at, expires_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, created_at, module_name, description, user_agent) FROM stdin;
1b517fbd-b7ab-4c9f-9dab-d28b17effa22	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	employees	0ac2c445-fd05-4e26-9db5-deda785f030b	\N	{"role": "EMPLOYEE", "email": "ahmet.ates@erp.local", "phone": "5555555555", "hireDate": "2026-05-01T00:00:00.000Z", "lastName": "Ateş", "password": "hopkop99!", "firstName": "Ahmet", "managerId": "", "nationalId": "11111111112", "positionId": "7fb9bdca-8ebf-4db1-b330-6b1ca174a402", "dateOfBirth": "1990-01-09T00:00:00.000Z", "grossSalary": 100000, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce"}	::ffff:127.0.0.1	2026-05-16 22:44:06.462+00	\N	\N	\N
ddab7f88-51b6-4ad6-8a05-54eef5fb32e0	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	employees	a29f4ac3-7a03-47ac-8b22-6d19135bde99	\N	{"role": "EMPLOYEE", "email": "ahmet.guler@erp.local", "phone": "5555555555", "hireDate": "2017-01-17T00:00:00.000Z", "lastName": "Güler", "password": "hopkop99!", "firstName": "Ahmet", "managerId": "", "nationalId": "11111111113", "positionId": "7fb9bdca-8ebf-4db1-b330-6b1ca174a402", "dateOfBirth": "1986-01-01T00:00:00.000Z", "grossSalary": 100, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce"}	::ffff:127.0.0.1	2026-05-16 22:52:03.025+00	\N	\N	\N
b0d59f41-6232-4ea8-8516-ece2e407a84d	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	leaves	fb525bf7-799a-4a26-b5aa-6bc6ab499370	\N	{"reason": "", "endDate": "2026-03-03T00:00:00.000Z", "startDate": "2026-03-01T00:00:00.000Z", "leaveTypeId": "78fa9960-2a6b-455e-ae31-8d463de91c2c"}	::ffff:127.0.0.1	2026-05-16 23:20:28.603+00	\N	\N	\N
9cf7aa91-ddf6-4f72-bc3e-a2a3cee7b758	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	departments	36937236-26b5-45d9-a8fd-f3105051c2f6	\N	{"name": "Muhasebe", "description": ""}	::ffff:127.0.0.1	2026-05-16 23:43:08.49+00	\N	\N	\N
baf2e18e-98b0-4b0a-8f7d-338a1f04333b	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	departments	836eaa60-e769-4c11-a45e-dfbe21198baf	\N	{"name": "Finans", "description": "Finans"}	::ffff:127.0.0.1	2026-05-16 23:43:30.467+00	\N	\N	\N
aba7a81e-9e5f-48de-b581-189f06c8a6e0	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	departments	4a0e3957-2fbd-4767-91ed-0d022c189ee7	\N	{"name": "Lojistik", "description": "Lojistik"}	::ffff:127.0.0.1	2026-05-16 23:43:49.051+00	\N	\N	\N
9a406a7c-d7cb-477d-99ee-ae3d8871aa05	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	APPROVE	leaves	fb525bf7-799a-4a26-b5aa-6bc6ab499370	\N	\N	::ffff:127.0.0.1	2026-05-16 23:47:27.051+00	\N	\N	\N
ff3a05a3-0a62-45ae-9674-acd9b56978e2	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	employees	a29f4ac3-7a03-47ac-8b22-6d19135bde99	\N	{"email": "ahmet.guler@erp.local", "phone": "5555555555", "hireDate": "2017-01-17T00:00:00.000Z", "lastName": "Güler", "firstName": "Ahmet", "nationalId": "11111111113", "positionId": "7fb9bdca-8ebf-4db1-b330-6b1ca174a402", "dateOfBirth": "1986-01-01T00:00:00.000Z", "grossSalary": 100, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce"}	::ffff:127.0.0.1	2026-05-16 23:48:41.263+00	\N	\N	\N
61f5f7a7-8eb4-484b-b42c-09d2b842e8d3	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	positions	c5adfcc0-c790-4efb-a209-36ef969709dc	\N	{"level": 1, "title": "IT Manager", "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce"}	::ffff:127.0.0.1	2026-05-16 23:50:44.518+00	\N	\N	\N
3f13fec2-404e-4019-8ac1-90611b9c011e	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	positions	3a3c0944-7682-4f2d-a1ab-5d85cbc2863c	\N	{"level": 1, "title": "Ön Muhasebe", "departmentId": "36937236-26b5-45d9-a8fd-f3105051c2f6"}	::ffff:127.0.0.1	2026-05-16 23:50:59.43+00	\N	\N	\N
044a9b68-6503-4a0a-9a21-7f0fc7ef5237	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	positions	0206ca46-47f1-41a7-adcc-2dcba8e42393	\N	{"level": 1, "title": "Genel Müdür", "departmentId": "836eaa60-e769-4c11-a45e-dfbe21198baf"}	::ffff:127.0.0.1	2026-05-16 23:51:17.268+00	\N	\N	\N
f9eeae97-626f-4829-953b-f01c98bbd602	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	positions	c5adfcc0-c790-4efb-a209-36ef969709dc	\N	{"level": 6, "title": "IT Manager", "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce"}	::ffff:127.0.0.1	2026-05-16 23:53:18.535+00	\N	\N	\N
b9888e26-6ee2-4112-ab9a-e99209f9974d	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	evaluation_periods	8f38f299-aa33-401c-b23e-9248023855de	\N	{"name": "2026-Q1", "status": "ACTIVE", "endDate": "2026-03-31T00:00:00.000Z", "startDate": "2026-01-01T00:00:00.000Z"}	::ffff:127.0.0.1	2026-05-16 23:56:22.352+00	\N	\N	\N
8a0ab650-da75-4152-acef-56fec58566b9	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	employees	a29f4ac3-7a03-47ac-8b22-6d19135bde99	\N	{"email": "ahmet.guler@erp.local", "phone": "5555555555", "hireDate": "2017-01-17T00:00:00.000Z", "lastName": "Güler", "firstName": "Ahmet", "nationalId": "11111111113", "positionId": "7fb9bdca-8ebf-4db1-b330-6b1ca174a402", "dateOfBirth": "1986-01-01T00:00:00.000Z", "grossSalary": 55000, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce"}	::ffff:127.0.0.1	2026-05-17 00:31:40.48+00	\N	\N	\N
7df25b73-cd1b-4e1a-aa85-6f27c545a691	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	employees	a29f4ac3-7a03-47ac-8b22-6d19135bde99	\N	{"email": "ahmet.guler@erp.local", "phone": "5555555555", "hireDate": "2017-01-17T00:00:00.000Z", "lastName": "Güler", "firstName": "Ahmet", "nationalId": "11111111113", "positionId": "c5adfcc0-c790-4efb-a209-36ef969709dc", "dateOfBirth": "1986-01-01T00:00:00.000Z", "grossSalary": 255000, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce"}	::ffff:127.0.0.1	2026-05-17 00:31:54.756+00	\N	\N	\N
77ec8450-d782-4e0c-b561-df02c40a519d	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	GENERATE_PAYROLL	payrolls	c8d3f656-5a9f-4199-9e3d-2924d7479f58	\N	{"year": 2026, "month": 5, "employeeId": "a29f4ac3-7a03-47ac-8b22-6d19135bde99", "grossSalary": 255000, "besDeduction": 5000, "bonusPayment": 0, "mealAllowance": 120000, "otherEarnings": 0, "otherDeductions": 0, "overtimePayment": 0, "advanceDeduction": 0, "enforcementDeduction": 0, "transportationAllowance": 0}	::ffff:127.0.0.1	2026-05-17 00:34:24.163+00	\N	\N	\N
a6c12038-20d8-4258-94a3-eb4e29a359ee	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	GENERATE_PAYROLL	payrolls	1b214663-f9eb-4761-8644-f1f825d85777	\N	{"year": 2026, "month": 4, "employeeId": "36f918f1-8267-4ed3-bda3-aba7ccc86ea4", "grossSalary": 44999, "besDeduction": 2000, "bonusPayment": 10000, "mealAllowance": 11997, "otherEarnings": 0, "otherDeductions": 0, "overtimePayment": 10000, "advanceDeduction": 0, "enforcementDeduction": 0, "transportationAllowance": 5000}	::ffff:127.0.0.1	2026-05-17 02:44:31.239+00	\N	\N	\N
3d2e694e-f2ba-47e5-82e8-8d248af720e0	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE_STATUS	employees	a29f4ac3-7a03-47ac-8b22-6d19135bde99	\N	{"status": "TERMINATED"}	::ffff:127.0.0.1	2026-05-17 09:50:09.699+00	\N	\N	\N
6739cd64-aa36-48c3-8f46-2203de3864ae	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	employees	0ac2c445-fd05-4e26-9db5-deda785f030b	\N	{"iban": "", "email": "ahmet.ates@erp.local", "phone": "5555555555", "photo": "data:image/jpeg;base64,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", "gender": "", "address": "", "hireDate": "2026-05-01T00:00:00.000Z", "lastName": "Ateş", "workType": "FULL_TIME", "firstName": "Ahmet", "nationalId": "11111111112", "positionId": "7fb9bdca-8ebf-4db1-b330-6b1ca174a402", "dateOfBirth": "1990-01-09T00:00:00.000Z", "grossSalary": 100000, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce", "workLocation": "OFFICE", "emergencyContactName": "", "emergencyContactPhone": ""}	::ffff:127.0.0.1	2026-05-17 10:18:18.589+00	\N	\N	\N
de3fdc86-bb64-4334-8796-6dc92ed19eb5	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	employees	a29f4ac3-7a03-47ac-8b22-6d19135bde99	\N	{"iban": "", "email": "ahmet.guler@erp.local", "phone": "5555555555", "photo": "data:image/jpeg;base64,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", "gender": "", "address": "", "hireDate": "2017-01-17T00:00:00.000Z", "lastName": "Güler", "workType": "FULL_TIME", "firstName": "Ahmet", "nationalId": "11111111113", "positionId": "c5adfcc0-c790-4efb-a209-36ef969709dc", "dateOfBirth": "1986-01-01T00:00:00.000Z", "grossSalary": 255000, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce", "workLocation": "OFFICE", "emergencyContactName": "", "emergencyContactPhone": ""}	::ffff:127.0.0.1	2026-05-17 10:18:37.281+00	\N	\N	\N
fce58cb1-4eed-4b06-bbf9-c999daafd848	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	employees	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	\N	{"iban": "", "email": "hr@erp.local", "phone": "5552222222", "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAn8B2wMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIDBAUGBwj/xABOEAABAgMDBwgIAwgABQMDBQABAAIDERIEISIFEzEyQVHwBkJSYXGBkaEHFCNicrHB0TOC4RUkQ1OSorLxJTRjwtI1c+IWo/ImNmSDk//EABkBAQEBAQEBAAAAAAAAAAAAAAABAgMEBf/EACQRAQEAAwACAgEFAQEAAAAAAAABAgMREiExQQQTIjJRYXFC/9oADAMBAAIRAxEAPwD25rW9FLS3oobqJyBtLeiilvRTkIG0t6KKW9FOQgbS3oopb0U5CBtLeiilvRTkIG0t6KKW9FOQgbS3oopb0U5CBAEqEIBCEIEklQhAIQhAISTSE+6gWaVV4jnfwtbounf9lKyJUgehCEAkBSOKazo81BIhCje7mt1igkQmhOQCEIQCEIQCEIQCEIQCEIQCEIQIQm0t6LU9CBtLeiilvRTkIG0t6KKW9FOQgbS3oopb0U5CBtLeiilvRTkIG0t6KKW9FOQgbS3opCxs9VqegaEDW6qcmt1U5AIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAIQhAJCUqYRUgacX/lo801z2t5zf6jNEU0swsc5vRbIfMhU4MaG97q2uFOhsVsiOvr270Fs4ul8/moQ+h/4lTb9bZvE/PRvVK12htGchObDp59ZaL9E9APz3LMtOVHQsT7S1tN9OYc5u7SJAEXXlxN50Tui8dLCtEKIMD6wb2ubeD2Eae5S1Y/dXIHlBk/nQ4dohOcKXVAyJN0hfIm7dM36Sp7NyiyfFfEhwrTjp1YbiDITGh2g3AX7xffJDjpIj6mOp5t3afspBhf+VZrrZDe10Npb7PWc1wwSE75aD4aE1+UJPiQv4rcTYbdJHN6pk3y3XmV6qNR8RjBU5yihPc91VLm/Fd3AKCBCc7FaHdbmtnKd128yO3bcrTC12rUgkCcoDVzMXxfcJwiY6Xcd6CVCaXIDkDkIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEDQhA0IGt1U5NbqpyAQhCAQhCAQhCAQhCAQhCAQhCAQhCAQhIUCoQkJQKonxEr3c1ZdutsCysfXqwxicOvYBvPXpv2AyCa0xmsqdFdhd0tMhPQNnaVz2Vsvw4WJjs3S0+0iXm6RMtgGjRMnqlMc3yj5UQsz7JtUKo+0qu+InadN23aTqjz+32y02+NVa4kS0ObqQ9Eribh1Cd8pyE+1J1q8jrMp8sIbGOh5xrnVFrYbaXT3yBJOki8ma522crrX+JBqq0tdGa0y7AATPRfoEtF6yIjHUNbhxO5rQd8tkiJT6Q7Flx47uk13NdS0E3dkgO5a8U8mhE5RRK3OiwoO3VaRInbOe3an2blI5nvNvLoMSREp3gHSLgL9F5uvXORXOdzf7nePVsUANHEp3XK8idemZN5dR4sZ1Uf29GKNEdKhoJpZM6RKV85X3jYumyfylgWex5yLHievOiOe6ljpl5nJoFxvaAASAA0nbKXh4fRxv40K/AyraYTGxWRImdhurhuqOB0pB0xfPRtu7zN4w690bl+Ax/q2U8pOsUe4uslJfEvE7i4kAmZvv3blWdyryJCZnXutlV9LY1rcDdOYIFwN2+6a8NbliPrPdU6qqrRKW4CV+ngqeDbOa9urq4gAN0uNqniSvYD6Tcl2OluctTaZ1Q2xzFN0zI1tcRMSuntl1rQs/pLyNaHwqIvtHPFLYky5l4F5BcO+V8142+HDoxwHOb0azLuJBloH2VO0wG4olk1XdJzgdMr5mXn9k8Tr6jyVlqBlCDnLO5sSl1D2w3Alh7Nt1+/quWtDiNisa+E5rm9JfIFkynlCwRs/ZLTGgxWt/EhxDcDsnPq0HcF6Fyc9MGUrFS3K0BtqbodEhupcJXX3Gffep4j6AaU5cvyX5b5E5SMb6ja6Y+h1mjNpeD1bCOya6apQOQkBSoBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBA0IQNCBrdVOTW6qcgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIQgFDFcGj3nGTe1SlY2XMtWTI1m9YtcRsPoNdp7exA7KuUoOTbM+LGiU03l2ie2U9A2zOgAE7F5Xl/lHEt9VcTM2PRCg1Y4xle6crp3CZ0AS0kqjyp5QxspWx0S0RHZpt8Cz1FpYJiUR0jMvMiQLg1stxWE+M6tsR+tpdqiU75jcbxfd1XAKzHrXeH2mJFtD6osRtTXezbUAWbwJ3z0kyv3ylNVjEayprG1N5zrhO/QNlxv+xvQX1sppqi3Npbo07ZdQ0S3aEubwZ21x8LebUBeLu7tAnLct8ZZlujU1VtdVE/htnUdwM5k6Jy81lWqLEispZDdDp5rnEndon9JrWt1MKrNU087m9uycpHTdvmSsKNG5rKXN48eJoK5a7n0pKfhR+ZBKqAP6ae7Uc13Obxx9k0FODHarHO/K7jtUogYf6uNqvZPDq9anZVVKXebppXQYmFtPNGs2en9FbgVQqaKaui1t8uyrs2fScGhDdDxNfmXO92QM+3TsOiao2xtb9XFzaXAHxF3iO8pbRGiRX46Xe65tJ7p3bVDEdErpfDq04XNvv2A6D3FUUIzan86HFbc5rmkd/amD8ytxg20U0RKXfy4mw7gTKXYbr1BEhOhVNdhp1mumCO2aAhxHMe1zHUubJzXNuIOkEEaDtBF4XqvIf0vWuwCFZOUdVts2j1lv4sIbKhzx13HtXk0v6uNKGudX73Salg+wck5TyfliyNtuSrXDtEB3Pgu27ZjYeoia0Avknk/wAosqcnrf67kq05mJoiVXsiC+QeNo6/kvoDkF6QrBysZ6s5vqeU2tqdZnOmHgaSw7RvFxHZesWK7hCRKoBCEIBCEIBCEIBCEIBCEIBCEIBCEIBCEIBA0IQNCBrdVOTW6qcgEIQgEIQgEIQgEIQgEIQgEIQgEIQgEIUUaK2DBdEiupY29xO5BUynlGzZNscW02uJTChsL3dg+/33LxHlXyidlrKrY/tM1Dc0ss8SdzpyDiBsEjIHbMm/V0eXnKp2UrZmoVLrM1xzDd5lKt2yZnJu4D3lxI1HNY72rr847ROV7iSLgABf1iWlakPg+JFrjUsa6I6qWrMk6P1N2ke6QY8/VTChZtzf5jXAl+0kEXEdZMh2qFxa5lMJzs1znXzeSNgMwJ+LQLzoTm1PgudzXe7OW6WmYmNvgNu0W2vbQ3DVtpbOQH1nvOmfeq9rtLYWLE6K3C3czQBLRI9stmnaHBTX2tbVi2kkX3bLzuE57Kr4LouJ7c23Q1rXdtw2z0XhBk2uO6K/VdS5xpq0dwuJ7QAqTmO6Tfyz/wBrVtUJrKmsht96q4EjSJCW3TMkhZsUtZzmu91rTIeKggl0/wDFJRxsSui+78k6Hj5v9qWhG1dHjtVyyMdW1zMNLh1G43jv+h2TToEOvFS7V4u293gtcWWEyDnYWcppxOpuZ1XC/wAvO/FrcjLtLYkKmjVpG+fafup7G/Va+BBiN+GfylPsmoo9odCfqtxdJs+y4G7sKswbXDisa3NQ4bnc5rZA7tXQe25WJVkwob4NUKG5uxzaXNv3ymb+wDSs2PHdCwvs0NuLWc0sce8ae9abM5FY52cgu91r6SOs/wC9E7ln2ljq8Gca7nVODmkbiAPuPmNMqUVzYuvV8NUxLqn9Lk0RJspNMSG3muncNsjpHdd1IcG89tOLWhyl3yuPcmUc7W977oFdD/lVfDzh2jd1i69MHv8A9SnY/p4ui5rpOHWDvv0H/UjoWDOVNc33bpG+4jYfI/KiqC6Fx3K7ZLREs8aFabFGiQY8N1bHQ3UuY7YQdh0dR0KuRRh5vmN/cmypxKD6B9G3pIbltkLJOWnZvKbWGmNcGx5S07n7xKVxK9MBXx7AtESFGhR7PEdDjw3BzXNdKRF4M/qvfPRly8hZdgsyblB2byhDEsWiIBIBwO87RsN2ghYsV6QhMa9OmoFQhCAQhCAQhCAQhCAQhCAQhCAQhCAQNCEDQga3VTk1uqnIBCEIBCEIBCEIBCEIBCEIBCEIBCFG48b0DyV5Z6UOVcRj/wBiWGJzarTiF4JEmnbIzmR2C+Zl2XLHL8Lk9keLa4tLourChudKt5uA7BOZ6u1fPlut0eK90S0OdGjxHYolIBe6Uw2Q0CRl1Ak6SrIGWiNW9zanRMU3OdfNxFwn2eA3SVa1Rum3C6/NtuMQiYDZ7BdLx2zIrxYzYVPOiumHdc9gnomL+qQ7qsFrrRGdGtTqYTZ1RKjhAncN+4byJBbGhY4jrU+qn2TcL3U4Z6aQNvfuv2K3Cd60/wBk53vRnO3bADplvN2lV7Oz11jXP9nZqfZQG6z95JGzw2yuBleDs7TRTS26lsqWTulMSvlumdl2yoAyHCY6il3NxOcZjrJEyZz39QO2jb7fmMPOpltvEiJS0z29XVep7VbmwmO9Xd//AHOmNIkQABedkh5Xrm3xHRXudFc779m7ZxcoG2mPEtD/AGsTDzWt2dSrUO6Slc7oN4701zHaz6sWL9UAyHV0lq5NsMR9NDqfrLrGhZ8Kmv8A+Mz2bJLXsDnQqXPph9FzojZkX3ykTL7hYyrcjb/ZEOzs/eHe1/lw2gnZfIXC4TVC0x7TCZTCzjYTrsTRKV267RLbu03laot7raxsJmFrdVrmaQQbwSBKYmb5HrWblaG1j/wobnObrXT7ARduE5DR2rnG7PTNNnhvf+956G7pNhzE9OnR1qX9kuYyqzx4caFzvZgmXWACR4KkLQ6E/A1rXX60yDeLju0BTQbd06obebz29QB0hdY5L9ngWa0M5tXRiYpb5EX+YIG9VbbZobH4M5rc10yN8pXmXfduTbSx1og5x7WxOhGh3k9x3btN3eqEa1RH1Z32nSdtuvvnfpmtBbRCdRnmOzkPnRG3dxB0d/ioG9JjqXeHzul1TQy1RIT6mO4696dr4mc7m7vp8kBJutTS7o7D2fZDC5j6mOpdoxbRuvuI0XHzSAN1WOp8frehw5vO8u7qRFhvtdRtLr6oe7rE75dWkdeyIjNYeNE7/JI0/lp1XXzEjx2bNxkqc99L9bV6jLR1fS/YgZNXLDbo9gtkC12KI6HHhunDc3Qeo9R40KpLp/3bt3ZpTQ6h9Orx80H1JyB5TweVOQmWtmG0w/Zx4bpTDhoN2wi8d+5dSvljkhyotfJnKsPKFkdVC1bTBc6TYzJ3g3XSnMEaDPZMH6ZyZb7NlOwwrXYnVQIwqbsPWCNhBuIWLFXkIQoBCEIBCEIBCEIBCEIBCEIBCEIBA0IQNCBrdVOTW6qcgEIQgEIQgEIQgEIQgEIQgEIQgje6lNJoZU535twTtZ/wrgvSnlyJZMlOyXYo7YdstTSNa8NEieyYO2QABOwTDzv0g8pv/qTL2CK1uTbE4w4TdNZliddpJuAHYdBmOGiR87Gd/Ka2TW3EgE3icrySe83KxlKI1z/UrDDpgNbJ2G/cCdu/vJkJSCz3vo9nZ3e62Jeb5aR3XA7BPetz0UUtixnNw+/uG8XafqdOxW4UJsV9LPwmuqa2JpebxUbtGwDds0qhBFeHmtxYrhvM+ratGz1PwsdT71MzKXfLR+m6o0YL3Wh9MLD04zukZaNs+saLtCLXFdCZmLPii06sN2jZeSTKctmm+4i9WYI9i2HCqxc5zr5dQ2D5m86FFaWu/As8OqK691PdeTsFwF953AASUY9rY2z4ovtrS6Y91nugbT2XXrNMJz9ftdi8ye9a9oslD3Oe7PR7/abGS0yG09ZkB1kLLjHp4W81tUydN5O09aCIua3Cyn3d2zQNqiJc97q3a3S0qQNc73elxtKaQ33kCwzxSFbgOdXjdrazdnbuO3SqauWVjWPx4dGGq/ruF471mtx1FgOBrX87FVe6e8znLaLzo2SS2+zQ3sdRDqquqbTeQBpBOkTA23bdhy4Vv9XpbChudFq1cU3nQJyIkOu7bLarBa52LNxGx76s3J195vJuAuJlpO9cbPbp2Ma0t9XjOw09KHEbOg7p7E4Phse2I+A5tXNquOzTKXirURraHVtc3DhibPEGW83z233zTGUsZqub70N1x0bDo65XdS641zsWLM+A/FCqq0xG3gnu29098goLfZoFopdC1nTd192iY03fLa7Mwor2uZhd0m6r5zkCBoO8SkdiqWpkSE/HV0mu0g3337b99/fct9ZUosGjX1m62kdh+YTQHM/8k90aKxjm6zXOO/Tt796G6nO44+m6boT8v93yQTxxoQDXx5JAaERIyl7Mf9V93bx46Ermu1X87vnxvUevqcfcdSkZEwU83o7uscdqKc0ufzqnc6rTpH24lNNc1r+OJpaceBNJofVzUCwIjoT6ebo442FevehjlM6B/wAGtET2TdSp0zSdBHwmQPuuBuDCvIHjG12s33dM9y0uTlvdk/KtktMGnPw34KnSDp3Uuu0EEtPU47lLB9cpVhck8qw8r5Hs1phOc6bf4lz5dfXdfvlPat1YAhCEAhCEAhCEAhCEAhCEAhCEAgaEIGhA1uqnJrdVOQCEIQCEIQCEIQCEIQCEIQCQpVHF1ZdK77+U0EMaNmoL3HDS0mfYJk9gXzpypy27K+VbZlCqltZhWar+GwTBJvnMmZu3kXTXrfpRy9+yuT0WDZ3U2m2+wb7gIILh13S7l8/5WtzcMCDTmLO2htMjVeCZz0i4Ak6QArBRtlrwNhwXa0y7RMT7NstPUZbXTqQHY3O6LTT27PCfkoC50V9WJznO6RJJJ371NKnDzru/ia0JIZ6H9vyWvYHV4mUthc7rO6e36/PIa3mt6jFduG4caexb2Ty2FBhR3878CDSDh01G6ZJ8OsXINVrsDocKG1tWs505yFxJloFxAHjtDSLDzTKWVOqdOJS3E8ja6Y0TIkNk99IMLI1DKWOxa0Tb57fLYBousMidCp2gZyk3uAIAA7/AkDSVUY+VW60PFs9m2RN2ictpJnK++83rPMCj2lo5upDb1Xd440rftEOHCY12tFpni0MbOU7jpJBv279Lljx6or6vafE66YAlduA7tHhFUIgc/o/l0DjxUQZ0FoMs+BrotNOs1rZXy2zIuHXwHGzUa+Ho4fIBLVkVoUGFCZV/3SHVMm/uG5Pgl2JsKH8VLJkdYmTI9vV1K1BscSK/VdV0d/UL5rSZkhrGYmtqdKlrpES6wJCV+jFp7VzuUdZjaowoDYWJ8Tm4obYgJAGwyN3fMhTxYfNwxOjrU6JzmQBKZF43bVeiw4dcKHFxRXYWw3Xm6RADACBvuBPXOSX1C0vqrbm4WmmloJMtuwXbNN+wLHk34Mx4c+qhzW04aYM3S6jPQNAu06FWZCrp9Y1qujhF2gg7Ovq2aRvmwxKGtqbDboa2oiTiZXaALgb5Xz6kRcj0MpzbcLZ4bp7ZAyu3g7D4p5pdbAiwY8Lmuc3nNq09h2jt6pz2pn3UUxWuiQuc28PZsnft2z2iU+rWtVlog00uc1t7XNu27NxndLYbtElRiws0+l+Fzb4cRvy2Ag6ersW5kxcGfaoFD6qqmubU2I3Qeojs+Wk7KzMGJlPvN40K/GhuhMx4oFWq3Sxx2iewyP6ETVWNDczEyn3XN2g/LsOm/cukrnxEDVqa3vcfqkcONo43pXBr/i4kepNJ5r6mu6SdQrDx9eN6kLed91FKjF/bs7upSwzVx8t6BWO/LxdLjqTuY6vWSPHHzH0Sgu444uKCI4Km/mb18fVI3A+r8rt96keK+OOAUwnBV/ag9q9EPKJrILbE9zs055GLVhuIBMtgBmSNGoeuXsTV8o8jsruybb3YsMSl35mklt40aSJ7nFfUuT7Q212OBaWasWGHjvAKzYLSEIUAhCEAhCEAhCEAhCEAhCEAgaEIGhA1uqnJrdVOQCEIQCEIQCEIQCEIQCEkkIFUFodS1rjqtM3eB8exTLmeXWUv2fkSK5jqXOuqmNtwl1zIlsGk6EHkXpHy8+35Ujz14c4TMWpMzIMrjITBuEjM33LzK2O1YbXVbX/Qdu/w2Layvac7aYjs42HA1G6TMAgiZAJ67h1Ln3h0V9LfaOc7mzlp6+9agazUq/K36+XzSVcfVPjUtphs5rfG8zPyTWN6fH6Ki7ZoTaMdWGbnb5ACZHXoA7T3Wm2uh+cfTV0W6ALpADZdMXdaoPc6FTzXaeyWifF01LZfaxqul4bJnzH6aUG/YD08TomHo7NHZcewDuU8SJEe+qFTq/iUybDEiDIaJaRPSfFUWOztp9WhVYXUu0XC4Bt9wJOncCBsK2IMLp4vaShtb2XGUidsxt0mWlUVHQW10vqqvqqvc8lt7id+i7Zo0AzYIDa6Xua5zr3bgBonsAF91w39bLXa2ue6HCqwuIc6683zkNAAM995J5oKdZbO60UwGNdS5wLm1HHLaT1T27rli5cbxx6lgQXRX1MbnOlGdOU7tHdtvkrsDI1ftIrqW6rojnX9gmbh56dC2bDkahjc7rObS2lp8Bxt2rXbZoFiZVFbTThzbdE+vcdkh4Llln/Tvjg5+HYrNCZTCgVOp1tA3zLrrrhfO5V3ZLjvfgwxXc68znfdOcho2E9RmF1nqsS0U1txOlS1rQD3gzAlI6dG5xvU8KwQ7KzpOdrOvMtHfLtvvvN653LjpJ1z1kyDZoTKn1VO1naXHbfeQAdwM95mrsOwta/4W4W0gbdl0h/tbrYFfN4+ymhWdtbvhk3DLy75LncrXSYyMCHkxrHudTzpO8AZnjcpDZK4LWvbih3VNlL5jf5LfbBbi4vmq9os9eKFS13keo3ecj36Fnq8cja8n0MzkJurOraJXad4l8iNMpZdssnrEFzXtxQ724p7LxPaL/rvXYxMD6tVzdZrtk953ab7x1nZj2+ytezOQsOEOa5u4XEdezrC645uWWH24mPAozre/uuuPYQsyKyhmD9ez6LprcyHFxauGbm9A3XzNxF/GhYlpg0Pq48NMl6McnnyxZ5bWoy3Bj1e5Svb/wDjf4jwTZ9N3wu+4XRysNA5v9Lv98b0gH9Xlx8k4Dm6rubuPbu+iWHxvB6utEPa/wD+TUjh0OP1Q3BxpHHh4Jw/t4/Ti9Anvf1fTjsUZwP91zfPj5KSeNMe3B4cfXyVDYL81Ga7ou5unevpj0Z5VdlTkxCi5yp1RqbSBIkkEXXC8EjqIXzNEq1v6l6v6CMs5rKVsyX0oecbiN8iB3C/zWaPdIb6k9Rg1pzXLIchCEAhCEAhCEAhCEAhCEAgaEIGhA1uqnJrdVOQCEIQCEIQCEIQCEIQCEJs6kDXnA7orxv0y5aoZZsnwnazzaH73hrZBoOnSToOkncvV8oRMDm/wmtL37JgC5oPX8pr5r5d5V/aWW7TaWOqxAZx2gyvuBFwBLiBsE7zKasHJWqM573d4buAUEJ9GLnUyb36SljHG5rNVuHw/W9MK2gH/wAlM00YnazdXq6+27uUQwf9v3Q8fm/VRSsqc9XBHzWGFrae/Z4cbVUaaEsMKDcySWwoLv8A7kTYNh7SZy7Ad5K0o9pa2zVMqbabRqUtvY03F3WSAAJ7Sd4njw3UUwGdRd2C+XdcO871p5v1iNn31VO/Da124SF3y7is5ZcjeGPajs9ha97YDG1RXSGGUmAaAPqV3eQeTvq+LOOqp9puG4AkXbf1UPJTkxDoz8XWdzr/AA0yPh+vbWXJ1GpEdT3gAd2gT3S3TXnuXXrmPFAZLbCZVS2I5ztVzTdPeJgEynp37FZgZLbCe2JFc50XmbobSJSaBIaDpI6pFbEGC5nxeJ7BuCdmOd3qLIzcw1mFjW8dfGhI2yt97j5/77tOn+nu4koi1ZrUQthNo4u4+qbTQrHMpUbxxx2LNjSAtUbm81THjySOHHYs1WbbrM2KzB+K3V79Oj6bljxrM7WhVYsNLnSLDunovnLdtvmukitWfaYGCr3cXWNBBlp0nrCSljiMp2H21UKrWxNpk687zvPbfMbVkWmDja73aft2A9e1dtboDXs9q2rEWdd+gz65advkuayrZHQn+9pq6Y23HbtI79pl3wycc8XMWmBrdLncb+pUSONhW1Hbzuj48ab+1ZsVi9GNebKKzR/T0dyC3H7vn37wgjm8diUGvDzm8d40LTnQ33+OOOpeHceKKfp3foZaUA816qHSwYPt3HuS8ynjq85+e5E+P137ZpDT+V3+lRA8OodxxctTkxlP9kZbseUGOpzMTm7RuPUdHVOexZ7m4/8ALrUEPo+9L6fZB9i5OtLbbY4FpY6rOMDvuPFWiMa889DOXXZVyA+xxqWxbK7C2qZLCTf2TDgvQ3LmHIQhAIQhAIQhAIQhAIQhAIGhCBoQNbqpya3UTkAhCEAhCEAhCEAhCEDHO/RDRQxHPVbKDner5pjqYkY0N79J7hM9yDm+W+UHWDk5bLWz8RzTmm1G+4hujTMid2yY23/M2VolD2t51OLeZGUz2mZ717V6ZcqtzcDJ+KmqqnQBIEBxOi7q3jevCbS+uN8LcPcJAfotYlQnB8SUFIAhxWkE8aVqJN428fRIeiopdf4Vds0Klmdfq3njzHcVDZ4db8eqrRiNezNsc6luJvXcLydwvWLWsYksDIlojc73vr5ldrkTJbotpa57Wt93YOqSy+SOTWxWOtMVuHmt0DcJ+d3YvRcg5Px5x7V5tufvj16sOTraydZvV4OCrC3ju+S04bKGKJkPVb73F3d5qy1c46UNFHB0diWfHGxATSVtkx/Hmozzk/jjZ/tRlStQ0/8Ax4437k1xSlMIWWoYeO3gcTRNHH2TVFRu48FXiDjz+qsuCieOOO5ZOsq1QK/ip8Rpl1iexY1tsudguhxW1Ndh6xucDtI0gyvBG4rpYjOcqFrga3vf7kPPwIVl4WPP7ZZ4jH46am9HQRdJw36L9ou0zE8u1wudTT7u6f0mu1yvYq/aMxObzdhn27Deb/neOYtlnzWLFrUvq5hu8jv6l6scuvLniw4sPHTzlAMfOxdJaEaB08LuPuFTitd+Zut9CF2lcbCNdzYus3pbvto4kkc3+ni7wPkgGtn/AHbpaOOvuQPfbh53V+ny7ytOZsN+PHxxNSuHu/brTHsr1P8Af68dSSFE5r+OPsqhzuOO25VSaH+at08cbNCpxzQ9vxIPSPQ3lV2TuUkKFU1sKNOHFa7S+qUndci0eJX0QF8icn7a2wW+Ba3twwYjI2sRMscCWzG8BfVuRbQ21ZOhRWarpy7J3dt0hPbpWarRQhCyBCEIBCEIBCEIBCEIBA0IQNCBrU5CEAhCEAhCEAhCEAhCEEQLsWHnfQKlaYrhadX8NlVV10yBd2/fuuxQ5uJi53lRbvUsiZVj2erPwYWDFIghswSTMAC87rkHh3pEyw7KuWI7oVToVbhD3MY06Z9YABnv2rz+NDxurdrYvG/6rWy7HbFt7tZ2hrarpbSO4EDu8MR7quctwpZpYba01OngVQpdjq/pSwgmBtaswGZ17aNbyWbWoms1niRXths53E1otsOdtMKyWT8WI4M1ZXXzcTukD3Aq9k2ythQXRHt5sobqpTdTMDquvJ2C++QW/wAmMmtdG9bqqzjSGbqbgXAbAZENF5pE9q45Z8d8cW9kqwQoUGFAhNwtaOPCS7PJ9nzTGrMyTZuc/Vbq921bQe1jP8ds9mjtXlk7XqvpPCFb6ej9VKBg47U2AW5mqrWdi8d/hp3qRp4u09gvOhdZi53Ixw4/0mHjb/tSRC3833nv0Jjy3ju0bJfdWxJUb6uP9qEj+3sT3njw470wO1v7ViukMkmkpSecmErKw3VQdRIAlcFGjCmOCeh1KcRXe3/JVYzMHHGzyVt+D/x0y7N9+xVIsVrGNdV8Lm3y0y7fNWYpcmfaYLYrNXFfTsB3iezjYsTKmTmvqiU5xrv6vHYbrusHetuNHh+7S7V0bN2/Rp27Vl2m3wGMc1+LDib9Qeq7ROchpW8caxbHH2yy+rxsdTvk8GciDffKd3UdMlRtEDVw/m42fJdNlCPDex1eJrrtgImBMGctt8+vZK7JMDA5us1t7t465bR2LtK42RgRIbmP6Xz7DtSB/Tq+vGxaNpgaurvq+qoWiFztXR2bpntlL7LrK45Ygt/M12q5vkRx+jHNrZV/d8j48XSStqYzotd0vr904Fvwu5zarj1T2cd+mDGmv3Xarm8dip2o4Kve4+atRQ5j/J3Z17Zg8SVS0lUqzk+J7aFzqnSp7bvqvpL0U5SiW3k8xkZ0SqG97faacLiDouGwS3g9/wAyWc/4r2/0F291Vss3MwxKtGItAIl10EzUyI9nQkCVYAhCEAhCEAhCEAhCEAgaEIGhAIQhAIQhAIQhAIQhAIQhBHG1F5p6UcqRLPyei2SFrWisxXNnMCqQHZIEHqA6l6XFPN6S8P8AStlN3q2Ye1uJvfc0CXbMk9yLHj9qdXaXYt4+igc7ota369pTnBzn1dpq7E17aaf7u9bZMTpJrgngKqVo/pWlkuC2LGbndX4SZ9QG09Szl1HJWE72sRmF1Ip36ZmQ299w2z0LnneR0wna1YdidamNskVrmxYmGJinmG3EjrcRMuPY266XaWKDDhUw2NphQ2hjW7mgSA8pT6lnZJsTbPBzlX5neJM+2Z8Ns1LGgWu1Mps8PC7naMMruz7b15Mr5enrxx4vWnL8KExsKE5rW9JzpA9QGk8bFVOXonMc5zm9FpvOwG/Z2d2lOs3JtzqXPbU7pOafG8+A79qsnky12HPup5zaWnRfpAMv1WpxLKb+24lnpw0tbINzl8rtwun2y09yWFynoxRYnOwtboG++V5u0yUMbkt0LS74XQxLyBHksuJkO12d/tWtiN5roe3u0+BWuxnldTA5Ste9tbmta7VqiTB6xv7vursPLUCL/EbV727u4C4V9jdX/wCTbtPXMcTUbTEhPbXVS3m3kbLwdnffu3LNalej+tNfiqxcHT1XpWxNVvG9cdZsoOhPa19Tfluv2957951rNa3RcX9O/r7P17Fiukjdm1BCqwIvvavj4cd6nJUUEppKaXKtGtFGph4F6nRNGjNhPpfrKvGyhChMqf8Ab5TWRbrXXVid+Xr+svOS5612uI7Cz/WjZx5rcnWMq37dlyEyqipc9buULnv9lVU7DU2+d+49+1Z0YR39J1XS03/7UkLJNptDKdXx/wBbfnvXSTGfLlblfhC/Ksf+LV72GXjOc01toa/+K34nSn1TvlMXCZvW5Y+TMNmKLU74nXLRh5EszGU5htKXZis15VxjmRGanw1NaRtJvEpeSj9pZ42cpw8bNnZs6l3H7Ms2q+E33cUrlTj5Lh6tO9uF23To/XaFZslS4WOdiQ4cWDnGfm6uo9R+p78W1QaH8aNl/YujNjdYo1TGuzWh3+9qp5RseCpmr0dvUrMuJlj6c0Tmn1a3G37pKW8z+36ItDnQozuB1oY5r9TD+b5H7LvHmpxDXwaaub99njcs2P0VpU9Bv5m7PoqdthuZrtpw9Eid+4rTKCAcbfe4HmvRPRJbXWflPZmsqbCiOzUSnbVOmY3TB7F5wzU46l0/I/KTsm5VhWmpzWNaHupvnS5rpHqm0AnZNKsfWMM1sa7pBSKtZH52zQolTXVNBqa6Y7jtVgLmFQhCAQhCAQhCAQhCAQNCEDQgEIQgEIQgEk0qEAhJJEkCoSIQUso44MVrXUudCc1vfITXzj6TrX61lWLQ6praA12i4tBA7QDI7z2r6Ay/GcyBaWsdT7CTXbiXADvvu7CvmHLsf1qNFiYvaPqxaZEkgdUgAFYMF+v7rWqOKf8AFTOY7Mudzaj5S/RdX6N8j2a35Uda7c1sSBZ5UtdoquMz2XePUmWXjOtYY3K8jkQ2I1jXOa6j4bvPSkcV6/l6yZJt9gyha7O2zxIsOG+lzdZjgZiY0ylfunPcvIB0XfmWcM/KNbNdwK1uqvQeRVi9Ys1LMLajnHbTIzDR5E+fXwlnZW//AC7P1XqvIWG1uSm0Npdf5nyWd15i3on7nSwrI1z2tf8AhN5vHHctKHDo/wAsN36qKDDo/wDJT1Lw9e7iQ08X/NMdrt43fqoLRa4UJlUV1LWrm8q8pnWV/Ohtc3Bm21RSBfOWho6zPsuVx7fgykk7XWmFgwVO04aToGk/6mqscf2updS4bOxeexeU0S0Miu9SjWhsOdUSJEcQW6LwBIdu/Yq0fL9tfkp2Un5JzdhiNzXrMOE0Cq8B2mYMxI7CQNC7/pXjhduMru47Yeq9vHUqz7NCfzfzfccT81ww5Xte9rbPEiNq1ocScryZi+eknZJdFkbLsO34amw4rW1Uuunvl9plYywyjeOeGTRi2LVczm/b9B4DcpbNDd/bTVt/2pWPar8KHnVjrfCWb4ncX75q+Dg44/2oBAoZgb81dEDB/rj/AErEvpSjGjEsqPHa/wD/ABWpbhgWHF11KqtEg1vd0VEbC1Wpqf2cCC6Pa4jYMCG0l0R2gSC1LWbIismSK31ZrDznU3D7Ky59is72w8/DdFvFLcV4nddfOYloleFy8flLHylaWwLJZnNgWiKLPAhxHUMLnSAMQzAncbiZSOjYqfKC3ZdyXlqHkT9z9azU2tgxaGMLpkiZDQDdtlslpXX9K1xu6T0685UslH4mH3oZA8ZXi8eKey2wIuGFHhxPhcF5pky05SyvGhwGRc3VPN1PdeRMyJ0i8m/yVu22nKmTYzf2hAbTfS6mcuqY7u27TK5dFWb47+JEa73fpx5qJ7q/d+hG0Hgrl8l5dbFpayPT/wBOM67uP0PkughRc6udxsdPKZT0WPBa/m/F1dU1lWuzYPd4+X0W3Tgq/qxHSLp7tCr2uFgTqceXZUwWyK33sKqMp5n5uDxctfL9n/4lFazWq8Zz8f8AfUqsKxOfiZib5g7l68b6eTPH9yFkTp4ft1K/Ycnw7faYTXu5wqa50ruo3bNvz0iJuTXV4KXU36rpXdovv3K7YqrFac/0X6rtujx/VXLL1UwwtyYWVsnOyXbItme6qmTmu3tOgp2T3uY/BiwkeII47lt+kH/1SzR/5llb5OMz5hc/ZTQ/H1/7VwvcZWc545WPq3kJa22vkrYYjHVNa0hrqZTEzK7ZcQuiK899DlqbH5NQ4bOY2T2zOkOcA6/eAPBehBRkqEgSoBCEIBCEIBCEIBA0IQNCAQhCAQhCAQhCAQhCASFKoY5pgu8N+lByvLG0Cz5KynGGsGNOtfIEyl3h8+1fOGUQ1mLpP6+aAJ+M1716TI8KFk2O57s3TDc7C01EkSYOrFPjT4LlDUgN96XUJD9FcVZjnfubm04WzPmAuq5Iuiwcix4kJ1NUU4m6ZSAuvXMxw31Pm4p+RP3XV8jS1+QY7ei8/Qrlvv7Xf8afvb+S8nQouTbTEfrZh9LXXA4TLyXmrbPS92dpbfOnRpmQPBezZFhxH5NdChOpc6E6l19xII0bbzs89mezk3nbTHb6tDdFqLWudFLXUgCYvGIXgggiWg6QuevLjtvw7XmVnhVvbXhhNdOn59p0Ca9R5DNrsFXveC5XKGSHWKM5uF1Mjnqq5zkZggS6t98jfcuw5FNosDm9GIVrZl3FnVjzJ1DFHbC5kFzmNq92oD5qWEFLFhVsXketwWV8oZWi+ysVibDdzYkSIHS3SABme1Y+TuSke1RnR8oR3VVYm3l79N89AAkLuB6FEsrWc3VVJtliMfVCbS74Zk+chtXXDLnwxnhL7ptp5PxP/pK2WKyNbDqgEQ4cNgGj5k6V5LasrZXfkdmRH2uI7J8F822d1NxmTImUyASTImQMtwl7bZ7dHs9LXxIdLZVZ6bRfddwdN+lc7lTIWS8tPi2n1LM2lza3ZmOcdwN4AInfxpXrmXp4ssPbzTI7LTb8q2OFFc6JS1sKHtk0ESb2AT8V6FlTIMLPQo9nbm4rcWch3EEaD23KWwZHgZK/9PgNhuc2rPRqiett947h3aFdzUR721x3VN6OiY40LOWz/G8NVQQBaczCdaG0udPVaQDIyJHz710eT4TszU/DUs6HZK41T48aNFc0NbU4mQmCJT7jcuhhtogtXms+Xo78QkNnFUlcDPY1PVYYFcL6IP5SPFMDJhZSWBFONdDlLnLAcMax9t89Jsn2f1iMub5RRYmWssQMm2eptjhupc6kyiPun4aO1dXZKmamFQWfIlks8Z0dkBtTsTnXgnfeL5rphZK55TsRcsOSXrXJWFBydZsdm9q2G1tz8JBHWZHvIC8ejQMeN2LnVXGfXPavcM02EymFnILfdiOvn1zWXacluixnR8MR3SiNa4+JBPjPSe7vNrhdFc3yCyY5722l7aYEFpDXOuD3Hcuky62HFguhva1zXNxVS0Dt+exN9XtrNSO1rebo+g+yrRLFEdifExdJvhxcpdvVx08+XOPyLZnxqs21rei3V8Ni07DYocLUbh+Jx8iblossGNXYFlazmrllk7TEMFFKR7ePorBYmOCw1xw2U7M1+WKn9Qc7tMvrJWHZLayrNZtrqejO+/QAdOnYO++d22wK8qub0ocuwEkHy+ifZ7XDtTGtpxXYqjKe09W3dO7SuvlyOPj7qKxZOierRf4cJ2s5tUzdKQnIkS6t0isS1sofTCbqxBT9F2+aosEdz3arTzQJ+HHzXKZPg+tZVgN5rXZ130+izc+x0wxZXpC/56wwuc2x1eLj9iuahnV91bXLm2NtXKeO1mJtnaIPhOY7iSO5Y1na7FixNhl7e6/6L1apzGPDsvc69v8AQxa2ssrWMd+HaXwXuvk+sF7SdwwkCW3vXsTSvnz0N2n95yhZM5m882zvh6ZVtcZHzHivfLPEz8FkZrXNqaCW7RMaD1hW/LCwlTQU5QCEIQCEIQCEIQCBoQgaEAhCEAhCEAhCEAhCEAoYoa+mrmuB+ylJTHjAg8m9M8an1GG+JhdIvbsmCSZ9xuXjtpDq4Df5ba+8iZHXKcu5ei+mOI6Ll50B/wCE2ES1t0wS0AS7pnuHd55a8Vpiura72Thh2zds8vBai1nZQwQYTfdl85/RdL6OI7Yr7XYH85tbesXA/Rc3lb8Zzei/zvn8kZDtsTJeVbNbWtd7N4c7Te2ciPCaxsx8sbG9efjlK915PscyC1r9aG6h2HvB67itXKNmoZgbU2kU7ZAaJgkAy2HSAZTlpoQi3PQLTCpzEZo7DO8HjetnKUX92a5jeb9F4e+n0bJbHE5Vs7rRaWuteJtQDXOmSACNF915E5Xy23KbktDzUGLD6MUrUgWB1ofnHtwtxdwPz0nwVTJbM1abS2mn2hdS3QJuK1PipZJY3IKsBVoSstWGzIkNROguZiZxNWg1OoV4ik+PFZzf7Qq8S0xHv/D+XZu3LUMFvRTPV1qd/tj0xHtiRX/hfmc6floUsGxRH83gS6lsss32VlkJrFtLVKz2NsLFTxx8lPSrDlE4YFKzECsZz2NPN1VXcU4uwLErpYzMpOWIBjWzlErHBxrLVXrO1X4YVCzOV6EVWSvgqB9nV4BMc1X2M91mcmeqLRpShiis8WRrE0spWi4KrEai8VHhQPCsvULgtRmuWytBixcpObCwudCPbonLvAWbYYtFPR4+kvBdDS39qx4v8tut+Uz+YWBamNs9pdDZq3Lf0xj8uijR81kG0xH9GTe03fMrChR2ZFyJHyo+nPubTAa7a86ol1XnsBWhaMeRIFm6UdtXZIm/wXJ8v7dVbIGTYX4dlYDE63kTPgJDvKmvHyy59Jtz8cLfuuUixHRXuiPdU5zi5zt5N5J70+F0uOPuoXBSwDx5L38fOdn6Lo0SFytsMJjqc850Jzt02kjZvDT2gL6RyHaM7YIVTWtdTqtN2kiY6rl8x+j+JmuVWT4r2upbFD3U6bgZS6yZDvX0zkzExtOq1zgO8kgDq+4WK01GtpT00JQohUIQgEIQgEIQgEDQhA0IBCEIBCEIBCEIBCEhQJz0yNq/mCkAVa3RHQrM9zG1PpNLd5kg8G9Jj22jlI6JTTU6nuABv73HxXDUtfb/AAb43/Pi9djy+P8Ax6FAfS6mp9VOmcrusENB71yAHtoTmYqm/WXhp/RbnwtZdvxxnV86IXeJ2dV6qkO/t8dCu5Tpz1LNWqfjJVDrt95p+/HaiPYvRvbnZU5Kusjne3sD6GfBcWH5juXaWg53JsKjnNP+uNy8j9E+UfVcvOsT3YbZAk342TI7yJr12Cc0/MRW4dMPv0jtHyK8O7HmX/X0NGXcJ/izk97fVouFuph8D9/muUgNzWVbS3m1VN6xp+q6KBAzT3ZpzsPhoWBasGUmu6XyPHkszLrpcftsQlaYqkEq0xZdE7FK1qhYrTFuMZEpS0KQN4460pwc7jjjQt8crTJNZxx1pjnJHxOcoHvUtWRNnFC+IonRFE56xa3MTnFLUoC5PBWY3YpW9YzzjW1asbFjWlrk4VLCirUs761zrXrRsVpx0rVjDcaVJJRwVYaPy8aUEJYkIUzmqJ6nGojcVVjKeI5VYpRVd4UbgpHJjtRaYrnbVExuhM/jRXVfCAB8z89yp/sWJ6/nIsT2WtuK04MOG97o+s7OP/yPHenZRZHi2OpnNwup0yUuRJ8I4BbbbTChwvwIPO3k3eAvXlmWLT67lK3Wl38SK57eyd3lJelW+0NyVyetlpZhi5uiH8RuHhOfcvKgObxxoXo/HnzXl/KynZEbwlgnGiIMDe75fohmu1ep43TchW18pLC2qlzorR/c0kTPVO+/6r6YyL/6DYXVVObQXObtxXnslNfN/o8ZDdyksNbWudnBRhBvAOi6Q7V9IcncGTWw8Xs4hGJt8y4zB8VzrTbKZPjqTmpHhQPQmtKcgEIQgEIQgEDQhA0IBCEIBCEiBUIQgEhSpCga99KqW13sYrndD7kjwCsnnO6Nyr2tzW2bHS7C6r+kkoPn/l5Cb+2HR6dVsNtTnG9rmAgz6pyMtE+9clBY17IVGs2be64gndtC67lz/wA+2PS5tVIbVKchCgg6DoBa4bL+qU+KaHMtMeEzVbLFdoc26/tIW4IMo67Xc7Nh3hp7/sqZ5vuxOOOtW7ZqQsVWGXiNH07lUP4Lm9FoPeDL6IJrFa4tit8K02d3tYLg5nWQ6fhd4L6GyXb4GV8j2bKFn1YjQew7R3GYXzfDPHgfuvSPRPygzVpi5GtDvZRnVwKultb2nT3HeuG/DynXfRn43j1mzF2J3Sl5afmsblK2l8COxvOpd4gj6rYL8GDE7j6KrlWzZ3JsfnOpn4Lxx7vpBZjqq4wrMye+uC1aLCr9tT4TtVmGq7FK13F61EyWQ5MiP5qZUo4jlu1y4jiPVYvx0pYrklnHOXO3tb+IRwTXBKx2NVcoW+BZYNUWPDhtbrVOAHeToWe/TcWrNDqjNrwtWzaoNibBqbzWgYd9/nNcpYsr2a1Mqs8eHGb0obw7xloVx1tr5y6Y5cnuMZ49veltgh0YHLEj67lPa7WsDKWW7FYP+atLYfu3l3gBNPm+j4ags+CpV4js0+pn5k7JeVbJb7NnLJHzjdXaD3giYTLa5uZU+1+nQ5NtmdY1acI8dS4zJNpcx66uzPrYnxWVomtQuTi5QvKdaRxQqrwrLiqsRDqEqNxwOUhUMY4HKs1kWBlUH4ojv8irzIbtXmrKyXlXJ7IObfa4LXNcamueAQZk3+KpZb5b5PsTHQ8mU2u082n8NnWTt7B4pMLb8Jdkxnusr0lW5tcDJcJ34bc5F7Tc0Hume8LhmFWbXaIlqtMWPaIjokWNfEc7STv+aqg4+ONi92GPjOPnZ5eV6Igx4Py/MJjVM4aqjGu74gtsO09GVnbF5SWZz6qocWE5uEnQ8Eky0SAI65lfReSDRZoTedU2r+mRPi0leB+ixv8AxKO7D+GKnU3jGJumRoDQ4SvnPfJfQOTjW+ro3ubpIJE5eZ8lzyaaaco2nW42J4UCSxpyEIBCEIBCEIBA0IQNCAQhCAQhCBETSoQJNCVCCI6n5j8yqeUnUWN0R9WFpNPcfNXS36qpb2ufZosPNOdVDLcMpX3bZIPBfSY50C2R4NTnfvMSmrqcZ3jRIUyBvv8AHhIcVvrLXc2kDweDPwPku79JuO32mtzW+3EZsPbOIJTEjeJEznu7V5q2NQ+rjYfotwWLa3Vb0Zt7wqrsD3N7W9xvCsOfnYNVOLW8Bf5SVWPzfB3XuQMYpYb3Mfgc5rmuw03EHYZjReozr8dSdx80Hq3I30iNi02TLsVsOLzLU65sT45CQIuv0H591asu5PhWZzotpgthU4nViUpL5wb0uOtK+HgwdS8+WiW9l49GO+ycse95IjNi2aFFhOqa677cda2Iblxfo7tfrXJ6B0oeHwu+Y812EIrzZzl49eGXZ1cY5StcqzFM0pGqkc9QRH1oemFOoifj+FWYDaGKINV2GG0UpjPtMqoWqyRH4rJrdH7ErksqZEiZVjU21rmt+XZsmu9GDjjgpHwWv1/8e79Vrxl9kz45HJvIfI1i9pCqzvSpkeyY0eXkm22DHsupU5vN2+e1dhDha2FvGhZ1uhtTIxvtxEeJHfU3NxKndyzxkOG/E+A37ruoNkbFqc+nyUMWytYpLxbHM2Wweq/8vDp+FWPUo9opzrvyrZEFSBidTqhZLHmls2R1CrtDVIx1CzVXjEUbnKF0StMdE95JVPe5V3uTi9RPK0ybNQWp1EFzua1pPgFOAs3L0b1fJVsi9GEfMSVjOVeM2s12yK7pRD8yoiUr3Vvq6U3JAG/3L3yPnVK/m93mFC/A/jepQMHw/TgqKPzXMVRI4f5fNRtGNT69LubSPI/qo4bP7fuB3m9VHpHooa6u14m+2aYLKrw3CSDLc4kDwN9692yIf3ZsWmnPTf3E4fIBeEejQRP2lCgWd1MJ1uY17rjXNri2/cCyd28r32wNd6s1tWKgCrx8pSXOtLzU4JrU9QCEIQCEIQCEIQCBoQgaEAhCEAhCEAhCEAkmlSEIGnWqUNoLqKek7yu6+JqdwWRlqNEs9giUa1OHCSQJSPbu7SLkHz/yxtNf7TdGa1seNCgimIASwiMZ0mU9AbI6JE77+AtP4ztXfh0Xr0DlV7WqAyG10KNQWua4SDTIskQNImAZaSDpmvP4447ltIdCiexp6Lq+4iR+iSMOd2/fjsUMM41Mw4PhcW9x/wBlFJK5rvd+32KkezndL9U+n2ML3Z/TjvT3MwN76fGY+aKrM6KlbqN52EHwcOO9NIofx1qWI2hn5f8AukoO49FVuojWmxP53tW+MjLds8V6gwrwXkvlL9l5es1pxU1hjuwkTn1TAmvd7O9sWC1zOc1eTfjy9ez8fL1xZYVICoZKRpXB6D5pEjkjzgQOY5rHp5j9BUI0ahZkfLMOE+nONqVlPHtdA2Pzv07vLzKmhxFyz8uwITNZUo3KStlLHUt6XHYrLWv0uu0dbGsq1fks61Roj39LzXJnKLX68Rzvzd6iZb8eCI7+oq3tdMdUjqbPHdic9tKgtVtbWuctVvidKJ/u9UX21vPckjVwxdbDtLU+tcazKjWakRPHKKjXc38qvK45YOudEQyMuOjcrbI3+K6r3Wk/IK7k/LLbUxtEJ1Lm633Sxz5x07YlSA5UrG9z6lcAWGg4ps0OONKFpilK5P0iWv1fIOaqxRogZ8yfkusevMPSZbs7lWBZGOwwYVbviP2A81vXO5OWzLmLj3DA34Up/tcklg460Be14krTjTHjBT73HySgpYgVQrClYKKndFwPnMJjHavd9j91ZZqa1LXOFXXpl9fNUd36OIbmRnWljW1QY8MNwi9xeZaTpImAezrX0HBDc9g5t/aDMj5leC+jCDFi2x1miudmozRF9m666LRM7iM4SO5e3ZAiui5+LF1olD6dwplp2zLSe9c619NYc1OCjGF7uNn+lKogQhCAQhCAQhCAQNCEDQgEIQgEIQgEIQgEhSpHIGPdgcuc5SxnDJVsjwfxXwnZioSN05ETGmd4nuG4LVtETPxMzCbUyG9ucdLSZi4eRJ7pGd2LyodChQantc5sNrnNa2Zc9wEmtldtJ27OsoPGOWNn9UyVkqBBdm2uhExG6snFxMOQOyYmbpiZ0aVw2XLL6pb48Pmte5odTKcnEEyvleCNJ0Lu+VTc/b2wGWmp1ndDbqik0hpLgCd4eZykQROQvHC5TfnbZHjvdEpjOL2uiaxBcTMicwdPb3rojNYMbVMxv4lPEp/VROa5j6VNBGs6nm/Mf7UouQm/uzXe985T+SnhQc7ZnUdKTewj9D4osDa7NFa/mv8AoB81Zsf4Lvhn4AifVeisow638aZH9FYjQ/YtdwcQkpRD9tFw80v/ALjNLasFjq1tJ6tpHyRWKHY/iXtPo7yv+0siQmvdVHs/sX9wuPeF4sdduHVu810nITLf7Iy03PO/drRgi9Rnc7u0d65bcfLFvVn45PdmGticFWs8VWAV4XvhwTXpyaSpWmXb2ueylmtqrnhyUh217nWuJEzXRa4gE77l1sRlasQoVDExvGuuCtHJGzWd+DOU9Ktxl5pf2LAhM/Dc5vvOPcF3EeA2LhWTarM5lTVvvXp1bJ/TmxkuzPw5huL33DgJDkqzMpwxGuiOw0xTOffxetdwdxeFFTXS6luGnW6tP18VXbzn9MOPktuH2loppw1RNn+j81E/I1mYxzsTvicdoB+a6Hn48Tb29V4UMSK1mFjasNPy3divtPKf058ZGszXuw87mtv7b70kTI8Dn63GhbMortRvH+rk+FA5z0jls2T+mVYchwK6ntqW7Y7C2E/A3cpbNAopV0ClTLLryW9qWBDaxOeU0FNJWEKAngJgTicC0zUFttDbPBix4rqYUNpe524ATJXiOVbY7KFvtNri/wAaJV2Cdw7hcu69I+Wc1Zm5LhO9rGxRepgvA7yPJeeO+36r1aceTrybsu+iQym/9qGHGnxRzl3cCk1f9qe01s+FMcMDXdFLDdS/ju+ioTj7fMKy6JXBa3ouqp48FBFbx17Pl5J7H1sbx1oj0j0WlrbY6O93tcxaKt4aKHDqOg6NwN+z2fIkRvsNVrnWRr3NpMpBx37JuMh1LwvkHGbZ2ZxjnZ32rGtxaTCcBIgGZvN20iW2Y9vyZGh56FQ11MNsVjqr8Je4jRpkG3dR7VitfTo2tTio4ZdQyvWdpS4nKIC/mt1k8BIGNTkAhCEAhCEAgaEIGhAIQhAISJUAhCQlAEqGM7BS3nXfqepJFjNZrup42dc0MNOJ+J3u7OpBC9jYTGtq54LnbyXCa43L1piWrLFpbTDc1rRChVbDUKjpldMd5A7OnypaolnszYjG1Rc4IUKG3S95mBPcBMkm+QBMrlyWVYbbPZm2aE5zorYRD4l17iTU4zOkvJcRuY3sVg8qy45sV7msgfvMZxi6wBhkOLYYEjORF523S0kLj8pQ2Nc6jFgZVdqEidI7AQCdpBOghddyktHrWXmx8MPE5kLbJkOZme8zn1CS463RfWI0WJ0u4yAAEx2DzW0UifqFYDm5lvNEmz7iQe68+Crc/wB5WIopY2noub3gz+qitfJTsbmv6I6pkSM/JTWEOodW3+H5zBOhVclurtLcP4kPnaLgB8yrkI5qC3DrRC3V6jf1TmPBBGQ1lsdzqmubuntHmquUG02PH1+RlNX3U+uN+Lzu+6oZZ5ze0+JJKKxomv5ob/k08eScddtfRASAY2t7vMqI9c9HfKP1+wepWiL+82e7427Hd21dzCiL55yRbI+Tbf6zZ3UxYbptq0OvAIPUZ+S9vyRlFtqscCPS5uchh9LusT+vEl5N2HL17dOfZxuApCVG1ye1ed6BJTNKjKc0qCUqCNBrw01KYJ4C1w7xz9rybzoTnN8wsyLYbXzKXLtMxWoItmp6KvLGptscU+w23ot80jMn2vn0t/KV2JsyY6Antf1bXNwrG5mvi/KrcKzLSdDb0UxzVOsW9VaKE2SmeVCSqgJSTSEoCB4VHLeU4OS7BFtdo1W83aSdA7SfkrUWI2Exznua1rZlznaABtXkfLHlA/LNvohO/dILjmm9M6C49uzqXXXh5X/HLbn4z/WRbrbEt9sj2u0OqiRHT7J6AOoC7uTCPYqF3+Tp/ZTE+xcvbJx4O1Eei9StFTPebzd6ZEx1fEmw4lKcRNBNfGxMePtx5qUCh9TNV3BSxRzuLuPJULCdWynnNxdu3xRDH9NXAPmoZuY9ruJ6VYH8zmu1m7idPcg7DkJbvV35vONh0xYT3RHOGCGHtMQgnbIDzuK9syMxzsxZmtc2JDa9kR1Jmww4kwROd5DpX7PBfN9gOtDqp0Yuw3AHxEt019AchLbDiwXOZTDa5vrDGtvLQ8tBb1yIvOi/rmsVp3kGnNto/XzUyjhijCpFECEIQCEIQCEIQCBoQgaEAhCEDWpyaeklCBU16cq1qd+FDp/EdT2CRJ8hLvQDGtiuzvN5vZvT6m01Pddp6pb0kQtax3w83dou8Vm5ajRW2fMQnNhxIlzXXexYJVRDO7CDd1kIKES0NtFpz+q2G50OA2nnkmpw964gdYdfeuPyvTaPWW1U5yJRDzbiCIFJqdLaQ0ukZcwAaxK6KJTZ7A6O+HS2zwBDs0N17hMlrSQBOt2kjZPYRNcbyiyh6rBdCZDa203uqbIBgDmmZdK4l7QLptpBAvF5Y8+yvG9YyrHzTaWw5w2U3ymSQCQJGQaB3HrK5qOW+1d7sm95Mu+QK3spsiQmRY76W55zsLdJkBIzlfebjpkdq56OcFPSdV4CQ8L/ABXT6RBAFUZvu3987vopHNrzDec5rh2mZl4kyUbcP9Q+/wBFbY2i02Z38ukt7ZzPZt7yoJ8mPb6/Q3Va1wbtuBBOzqKuPfqufT/zIpbskG6OxULDTCtmbp5xq26JmXdIKy5+CB/7pP8Ab9/FBai4LS5tTfxBTv2H5ALPyqf3mL8UvAf7Vur21WtiFW+6naqlqNcFruc5z38eCKy4wxNxcwdqcG1Zt3Z+qZaRib7rG/JK19Ip7/kFBJHwRvibx5hex8k/b8nMm9PMNpd2XfRePWw1MhO93533+JXsHo8dneSeT/dDx4PdLyXm/J/i9H438m7AtLmPzcXC5X2Paq0azNis95qrw3us76X/ANS8kvXs41gU9qqwotassKCVpUrCoQUoK1Ki6018cSUcQKFsRBirp5M+Jz1C9DoqifEWbV4aQqkYqWLEVSK9RUTyonJzymFEIEF9GJROi0KraXuexS1ZHHekPLkd+bsFndTZojan73yNwO4betcJPGt/lw7/AIlCb/0vm4/ZYEPXXv1T9sfP3X99LE/x+ykYcDm9/wAlEdd3G1OgldXIrTQxI4cd6Vo1mpJ4G+P3QPgPowv1VYaObxcqvPdxpUkGJRhfxu7kWHRG4Ph4H18ktmiUf4uapP8Ax8Rpu33hV5UvwaqI0WUse1zHYXN1qR5nqu8CvVvRdlR2ZdAc1uFpZVdqmbSQdMgTDJE7pHcF5FAfRh5v13rsORWW3ZKtjcWZgNcXRHVEggh2IicpAGU9N40yWbGo+k4D62Q3cSPAVlZuS312OnOVOhzGLTpmJ90lohZQqEIQCEIQCEIQCBoQgaEAhCEAo3N6KkSSQMafeUERrnRvhb2aSN2+/wAFZLVWq9s6qmlrZudo2nT4IEtb2woNT6WtqBe7cAZrHcWkRMqZQphwoYzjqmnAxsyB1kXmW8nSQ0h+UIzrbGbZGVNc6UbbsvYCDdpBcRuaBfNNy0G+rWSzQnOc50dlMNzZ1kYyTPbIG/ROSkVjWt8SuG60Mdqi2RIcRwFDjISnsIA0C/RtN3F5ePrHrOGqzRIrM+1zhOQcAGzAmJkEgCeiey/pOUsWI+2ZhjomdqNTmtm2GZgACWkgGQndMglcfymyk2z52HCwtguwwbyKmgsF+8Ckgk6RPbNWNfTicuR/WLe5zNXOUsp0EAUgjqwg9SxIjdVvN/Tz/RaTmVRotHNkMO8i4CfaFnue2K//AKXyEr/GQGn6rbCKDDrY6J0XVfYfNSvfRG95sI9g0gS65nSmF9DGt1anVup0cAT8VEXex96J9bh9T3oJIT6LZV7zz43T8yrhPtm9Frnc7qnp7JqjDDfWdX+J43zl5qdx/t+xQiezRKWVcaDv65JLW2j1aH/0sXf/ALKZBh517YdVOccG9wkO++Z7gi3xK7Y7o3YdN0wAPCXiisuMPbU9g8Lk2r5+WlSxOd7s+PmUsGzOdifhb0t/YolLTnYLWs44l5r2H0atc3kzZob8LmueKfzE/IrA9GHJOHle2RcoW6F/wyxulm3fxomkNJ2gXE77hvXW8jHV2OO6rWtcX/Mrh+T/AAej8b+TpGsUVogNcrUMJXNXhke3rIMJ0LUU8GOrL4agiQGqiwyInB6zyIkL3lEbU7nqjUMVMMRZptSjdaXKq0zEUb4qzXWhROtLkRdiRVWdEVV0dNzidLFkuUL4vQUbi56QBTqcK1qjjaimAUMcYEV5hy4d/wAYb/7Q+ZWCxd/beTbuUNuygyzuc22WezsfAhywxL3zB3GQElwUSG6E9zXtp4vX0dX8I+dt/nTXJWlI4IatuSYjncbkwc5vvJwxs47U06/xIoR/28SSgccdyQlVE0CJRT8XgVLGZzoX9PHy8FUhHH8Sstdjd8WqopsKlzP+3fo+RWxkO0thW+zOfTS2IKqujtuu6zKe8bSsp0OrU1ui7T2jYdOj5qWDFiQozXMdS5uJrtx2eYSkfSfo8yp65BtNkiu9rDvbVKZhmRaZjTrSn1LtGluw1Lwrktbo9it9htthh+wz+q6JXQxwIAnK9oAIJnzBokvbsn2pttszY7am1c12kEaQsLVtCEIgQhCAQhCAQhCAQhCAQhCBCs63PhwmNrppdOqp10rie4AHxG9XYpdRg1isHLkQxbfk+xU1QnOLosNukgSIEusjboAJ7AmsBd6vEyhaMLo03Ma5pBDTomDeDcLtmhZFujOhZShOfVU1rnNpdKbzhAmRdKbj2X7Sts2hrWVOqjOqwth3guN4aJ3TExpl3SXK2iLnY0W12h0PNQbM6K6HUKXuqwtmQCQZXGV8jpuUaZlrtbWRrTlJjm5izuMGA6ltJIAxA6JF4k0S5pO8nzrlDamuzUBkVzqZNq3nS4y2yN1+2a6nL9p9SsDvaOpbHcxrYj6s/EAIiPI2NmXCWnEdC8+tUV0WM5z8Tm+9tJlp0kg7dMxNakWqcVzmVNZrRPpd8iVnudTU7nfMnb3fZaDx7allLW3ta7qAM5bZADzKz45ow/0t8r+u/wCfUtMIOl0dX7lNJqxe98pS8inU4KeNPHgpIcPV51TvKczLyvQSEtob0tHbfMn5DuKIhre5vGnT5FMFL43/AI6N/wAz5pGVP1Odqt7JBFaOTzjdF1aZBvfp8gO4rOdErfV71Xyl8ldefV7M6HrYZVb5iZPZK7sIVaBCzWJ+tpa3d1nrROmtgY6ovSJa36nq6lK81/FzUErV5IZMdlflJYbJTU3OB8T4G3n6DvSJXsUSE3ktySyZk9mFvqwc92it5AJPbMrK5DOryPnGasSPGLe+K5dby/yVFyryPi+r/jwW1s65aR3ifkuS5BMzXJvJ/vQp+JJ+q8n5D1/j8dYzUwKQBRw8GJTS5zF549VRPao6VO73EylEiu9qrxYFSvOCjcxRWTEsigfZne8tow1G+GnDrBfZ3KI2dbMSGq7mIrOEBPDFZcxJSnBBSilTUopV4nURaoI+orT1WjKUjHyLa/UuVTv+pZsXc79Vk+kvIsOz2yFlmzt/dLc6T2t/hxQLyN0wJ9oKdlWN6llix2nm42O75EfIrpMtwf2h6OMoO1nwRnm9VLgSfCa92nL1I8W7H3XjVoh0U85ux3G1RjUVwFr8L9V3l1hVzDdCe5rv9g6CF3ecsHXp6SJYPhTGfdTHpdJRTG8fRBGD4UBOIx/F/tBHD/Gb8Q81YOL2jOco4bcbfiTIMSnDx1oizrs460rInNeo2vo4ukpgxuehc3EMW68TRXW8l7ZEi5HyhYn2ml1lhesQNwk6ZB33hsu06BMr27k5bPV7HCtbKW2aNDztrhtafZxABWQL9BBu2tAle01fN+S7dEsFpbHY3C5rmPbeAWkSMuwkHuC935F211q5K2GIxzYznNaypzhVn2ASuOkmQMz1T0lSxfp6U11Scs3I0WuyBtNObNLWu5rSJgX33AgTOmS0llAhCEAhCEAhCEAhCEAhCEFZ0SqNSzm6ztnZxuXOv9lb4+VqqnWiHEYzSSyGyQEu8uJlKYI0kBamUbU6FZIrrOKo8aLmIe2RqlM9QvPcs+1MbCtMKHZ20wLK1kJrr5ElrgB2CbSeJhPHe71aK5/8NtDcWl5IBAmbgSRIbj2Lico21sLOwGRXNa69zncyU3A6LgGCRI0k3XC7pcu2qHYoLnRWxGwIM3t0zeQKQSNMySSBK+U9t3kXKvLcf1OLU329seXRKWyAaSQGm+ZuDRPRc4y0K8WM7lRlb9pWyFEhOqhNb7OH27SJm8unduE5Cd+K2qinDU50+64DjrTILXRbS1tWLVq2z0E9wuHYpQIeJ1TaW87ZKf6m7dJa4KxphMc7Wpw4ZznpMvASVGMf3l7cNLXHm7gdE5yv+QV+M6j3cWHDov09spnvCz4MLH/3O0cSRDHVP1+c3r40qUmjUd1N63SmT5ySw2Nfi7B+gPGlSwoVb3V6rWVec792n5oKrW0YeOPsprMyjF0rm7LhpPVu7UkOG60Pc7Va2dX1l4qZz214OjLsGwBARKa24W4W0tbu3k9ejx6kwBIE8IGP40r0j0J5MzuUrdlJ7fwWCCx3WSCfIDxXnJC929FFhbYuStmiU4rVO0O65mQ8gPFWJXe2MNex0B+quQjZKbki0us0JtMDWhdQvm3un4ELrIRoenZWsDbfZsP4jcTO39Vx3a/KOunZ45f45mGVMMHvKFocyqvC5us3dLZxvCmYV4o95SxRyUoTXK8TqNzU2hTYXpoh9D6Jw6jo+FRvYrUlE8JYSqEVqqvCvxQqcQLDSuWqNwUzyoigYghPAQ4LSK7lVjK24KrEUVynKuyRrVBhNsraomdbS3fMykPH5rvsjZCdC5MRbFa4mcdaIRhRKdF4kZeJVPI+SvWrT6y9uGHhZ26C7u0DtK62LDzUGFD94L2acb4+3j35e3zPGhOs8aLAfrQ3lju0Eg+YSlrYrKX83nbR+i1uWsJsLlblVrNX1ku8QCfMrHYV3jzookOj82q7ji9LDP8AcpZ81+JqaYNFVGJvmO1Wp1G8UPSj/F2HjjSnazP8k0dLiXH0UUDBGb7rvKahIofSrEuPlx1qGMFYHMPNfxvCmgOc2pr/AMPVq0yJnK/x8+6tCP8A8VZZjZT0peWj6+JQTvDmWb+HTXPDrNw39cr/ABHVf6j6HcquistmRg6G1zYWeZhm6IQdG3RdIymCTskB5ZDiexc1/VhdtF4lLfeL7tG1b/InKMTJuW7Ha2OqhQYozkOsCbXghwB3ymeuY0KX4H0fyaiueLZXrZ8EdhY0i/aL7r1vrHybZ22W0RXM1XPpp3SaAAOwAD/a11gKhCEAhCEAhCEAhCEAoo76GOd0WzUqpW6OyAxtbtZwpa28uvFwG39UGRa4tNvs0OptNla97m1aXDQJ7hpJ2d6mdZnep48UV03Na68lxliIunKdwuukLlTyaXWrLdpjvbTm2thNh9Aum8jcTOm/q0XpuULfgtOaiUtaxz48bc2ZAaDpJIBAvErzdMIOI5fZehvsFstfrLc1Z3tgszLQREjEzMyRIgAjZSSSDqryaLE9YtMWPTnHNe4uiNmK4hn4AAgaN5V3lTld2UI0BtWrNzIbZUwwZS0bZDfITAF15ymhz2Nh6rdXqAvm7xJEluCWE5zGOj1a2BlOl/joBv8AAbyiI7Vhvdurp0Xc0dWzrUcR9FVGGnBVu3d58rtN6QtwY3U7XbyRv8z2+KBlqfnamspa289QAv8Al81JEDszm/7fkOoz+qnZDzXN5xwubeSDKo/OW+UtBKbGbRie5udc4bsAA2C++fdd1odRBzYTMbcLdZu/9CfJSPZmoPtac7EdW/fMyIu0CVwlvB7mOiY8HSrbh0Hf1nrP6pjiga44KWYW9HjSUwpxTFQ5qcmtTiFArV9Fciy1/JjIrWfw7DCHeGgH5L51avpDkbDbC5MZKoxO9WZ8r1YlbsJX4TlShNVpqlIzst5Pzv7zZ2+153vgfVYrHc5de1ywcrZP9Xe602dvsna7W7PeH17PHzbdf/qPVp2/+apSTCaENPQShy870mkpwKaWdDjjgpAHMQS1YFE4181E01xTpxDFYqkVtCtxHKpFKw0qRVGnvKaFQoamuUoCY5EVoibZrI622lsJna524J7mOivbDhNqc51LW7zx8l1mSMmNsUHHic69zt5XXVr8q57dnjBYbG2ywWtY2lrdXu0KK3Oxt+JX47+asq2nndG9e2R4be+3hPL0f/rDKv8A7o/xCwgtblZF9Y5T5TidKOfIAfRZMlUBStdQkKEEuF+v/U3b2jamOguZiZib7t/kmhOBVEf/AG/JIRzekpxFdqvxfEgshP5rm+fkb1OIphut7v3CnglOiwHUeypdVKqnq6ioIfRfh43KrFwBsK0wnPb7KJIu7Dp+vgrkKDmsqxbM+L+JCdS6kkRCW1MF0jiIAmLwSqgOdZm382dLt22XYr7437zkq1spa6GyGHbATDdtJOmUt2y4KQr6V5H5QdlLkrk+3tbU6Ixr4jXadAmDdsEvBdM1cD6Ki2FkSExlXq0aEy0QmOvDA5siAZ3CbTdskN67uDewdUx4GX0WBKhCEAhCEAhCEAhCEEbw7pU+Czo8BzozqHVO6Tt/2H1K0nFZeUY7mwXNs/48RuDdIHSO0kDSNI0IMSDHbFszoVhc53tHVxGtvAEmmV15Nw339i5j0iZUbkjk3abNZM212cYx3PxFznSInpABJN+KQlcV1dltFiyHkTO2uLBgw2xYjWZ6I1lZD3DT4knRiJu2eG8ucrNyvlV8L1mHGskGosdZ50xnlxLiNwvMiJTB67rIjlYQx1Zv4W+BlvlLr+adHi5plLNZ3O6tw3DjYpDm26jXU9308UZz4W/Dd3di3xUcBmrhbDpdPE3SezboUgpY+rW6Owdvbxeoy5NJQSxIzn1c34bv9pkPGo1MAgVIUqQqBrlGpSmIHNSpAlQKzXX0byF//bGT8WrD+pXzgF9Eej2JnciQms1W6vYQD91YlddJSsKiBT2rIfNOONlKYkBRWBlPJzrE90SE2qA7Wb0J6T2fLs0Ua115xLnsqZLdZ6o9nb7LnQ+h1jq6vBebbq+49Wrb9ZKjSlqULTzquPkn1rz9ek6TVDFanvco4j0pED3OVSKHK25VohWaquWJWtQ5DVSnPUDqnYWNqdqt61NS572w4TXOc50mtbpJXU5DyC2xfvNrpdH6Oxn69a3hruX/ABzzzmEV8hZFbZWZ+0N9u5v9AOz7rRtESjUU9pi0aizYr6nr3Y4zGcjw5ZXK9qNxVO2c5WwVn5WfRZorui0qsvn7LAb+2LdRi/eYn+RVEqxGLnRorn6zojj4klQkKhpSJUIAJUAJZKhrulxJAKfJMYOagcE+uvC/E33r02SAgeBD95vn+vmnth9DFi6tmgyIv/2oQnIPoD0Yx4FoyJkihrs7BsIhRcLb8b5NvPbxNd/ZIriz8OJrHWbTdM9xXyfkrLWUskRs/ky22iyu/wCnEuPaDMHvC7zIPpky7YA2FlOz2XKEPpXw4niJg+A7Vm4j6Am7opVwGQfS3yayqc3aosTJkX/+bSGHseCQO+S7mBaINogtj2eLDjQnCbXw3BwI6iFkToQhAIQhAKCNFhwobosWI2HDbe5znACQ3k7F55y19KuTci52xZHa3KNubcXNd7GGetw1iNw7CQvGeUPKbLHKSNnMsW2JGZzYLcMJnYwXd5metWQe5Zd9KnJfJrXQrPaYmUInRsTZt/8A9CQ3wJXmvKL0rZYyk9zcnQLPk6BUKaW1xLjdMm4dgbp2m5cBNJNa5BYtdstNtfnLXaY0Z1RdVGiF2ndM3bPAKCaaUFApTZpUioEhSpCgWGMfwqVMhanxJ6BChLNIoGkJAEpQUCgoSAcccfRRxpQIF9Bejh1FggN5tos0OK34g0Bw8ZHvXz5z8C9o9FGVfXclZh/49iiYetspeYmg9PknhK0NeypnOSEKIWaRCRFOBSnGmhAQY+U8l0VR7I34obfMjr6uDjVLswViZYyZrWmzt+OHv6x1/P5+bbq+49Wnd9ZMipMeUyaRxXl69RHlVohU7lA8KKgeVJY7PEtUbN2drokX5dZOwK3k7JUfKT8GGE3WibO7eV2FhsVmybBzcJvxOdpJ6121arl7vw4bd0x9T5V8j5HgZNZnH+0jubiibt4buHz8hPaY6LRGVUr2ySTkeK229qOI6tVIiuPFDFSiFVDJrJy7HzVgju9w/JacVc5y5jtsuQY8X3ZN6yRIBFeInUqURU5URVRGkSlCoUJwCa1PaECAJsQUPb/SpgE2Kytn+KBoCJIhmtifJAxKnAJJIEQE6SRATWjkbLmVMhxs/knKFosrujDeaT2tNx7wfFZyEHsPJf00xGUwOVFkq0BtpsTb+1zCb9l4PcvVch5eyXl+y+s5JtsG0w+dS7Ezqc03g9RAXyTNWsnW+15NtbbXk+0xrLaW6sWE+ky3XaR1GYU8R9ggpV5X6PPSnDyvGhZJ5QZuz250mwo7bmR3XYSNDXHdoOy+5epTWOD44Yfyp01GMEZ3vJy6AKVAQgEiUICgRInEJECFNcU4lEMVv+FUSgUImnEpigUceaHN447US/MiaBp9xNCc5IUAE13HYnHAkCA1V2noqyn6lynhQHu9laG0d+kfVcUrOTrU6xWyBaWa0F4f4EE+SD6qsEah7oD/AIofZt8Pqrklg2W1esWCzW2Fiwh3letyHEbFY1zNVyBCEifNNKgRKhIgVKmpUGHlnJ1FVps7f/cb9QsNdXlG1ts8H3naqxYmTmvY1zIuJ2JzXXjfpGgdxXm26e+8Xq1buesmW4LVyXkR1opj2vDA5sPa/wCwT7LYW2d7Y9opiUydm9AF+sSdJ6lviJWxTXo+8jbv+sQ2mExrYTWta3Va3QFBEcpVE9eqR5UBSAJzkiCGMFTeFeilV3NQQxQ2tvvLy/0qZV/AyWzpZ1/yA+Z7l6TbbRCs8GLHiupbDaT4LwLL+UHZSyrabXF/iOw9QGgeCDNcEwpyaekqIyE1PcE1UK0KQKNqlaECySyQEslBWbhjUqZqitI1XdFPY6piB0kBKhAiJIKECSSEJ5TSFQ0oSpqBZ4KX6qusyvlAtnEypbazrTtMWc/6lRKa03d5RE0Xmu4vTpJHjAhhqY1yKWSEqEAkklQoEkkKckKBjipIAwVcSUT1MIrdVA4pifNNcEChDuOONCRK5A0oKUBMJQKmpQkKBClahCD3r0X2/wBd5JQIT3VOgto8LvouvyZGzT3QH6vNXk/oVyhRGtmT3u3RW94kfMea9RcKY1SUbZLU0lRwIlbKVJQoEmiaC1AQKFBa7S2zsqf+Vu9JarVDsrM7Fdx1Ln7RanWp+cf+WnQAgdELrVGqfic5aNkNFm/E9pVqtZPRO+Z0Kvk+Ep4wbCY11TqqtXRLv2oJTEhvpa91VXukEbL96igF1ifTFiVQImrVzOPomxxDeyE2zuqdpdtkdJvSZSZ+7RfdaPGYQaBKjcVVyVavWGZh+s3VdvG7tVqmhiCIprtRTSwJ8NrXoKLWurTosJz2OcxWY9MJVrTbW2djsNXR7UHA+kXKfq9g9WhOxObN/dKQXjbyu59I9rrtmbq5oq+a4NxVWhBKQJUQh6KYnoVDVIE1OagkkhJUhQMjNrYq0BytmlUtSMqLaVNYU5QCEFCBAhKQhA0hNKeU0qhpTBoTylhjAEExUcE4He64qRRQteL/AFKCYoQgoBIEFAQCClSFAxwURa7mO/K7QpiEiCLOxGfw/wCn7J7bS1+v9k+Sa5vTaqJWva9KFWzLeZU34UghxK8ERBZcUiAhQNKCgoQIUgSoQdP6N7d6lyts2KlsRroTvCY8wvfnr5jyZafUspWa0s/hxWu7g4T8pr6UscVsWzQojMWFBp2Y4FaEStlVKpQCrAdQ/wCL5qCWagtlqh2VlT/ytUNrt7bOylmJyw7TEdFfVFdU75dSiyGWq0utT6ov5WpllgurpRBhVPWzY7LQ/VRamssHBqu47FZbD/MpgG8zC5KHdNtSrKtQ7mN/pWblcuhWN3SiODW/Urac6H739M1lWyDDtFs1vZQ2jD1mew9yDGyayJnqn/6XS2eM2Kz3m633WXCb7bArMA5p6Ku5ujUURNCnbEbFZg5ut1KuRUiIbXGrZ7yyYz/WI1XNa1WbfEoqh/md9lVtH7vYHO92aK8T5c2jO5bj+676AfRc0VpZej+sZSju95ZpCsKETSIRChIlmknWqEc9qBGb7zlHaILtZn5lGyDXr1OQTm0N93+pMdaeGtTmwGqQMaoKhESKpWQOmrACWSoGhCAhQCEFCASICWSBEhSySHjjjyVDSpYP4YUZUln/AAh3/NApUANEZ3w/JTlQEfvP5UFiaQpUhUBNKhACASOSlCBhSJyagc0pSkCECJwCUBE0AkKEIBIhCBpQUqQoEX0NyLtnrvJ6xx+lCa7xaJ+c188leyeiK2Z3IOY/kvcPEzHzQekQCrL2VsxqpZnY1oDUQZdrsteo2lUIsCh9K2zrrPtzcdSiwWGA3WWrCZQ9ULLqVK/De17EKkKRIfcSzwIhCuctsRzLfFxc5dFiXL25375F+JFi/ZjWrDm85VrIFfaEDIIcyNnGfmanW52Bua1narVNChqctRHNxIftqfexfdU+U8b1fJsV3uroItlofnVw3pHtfq+R4/givFrS+uM5zOc5VynOKYVUIlSTQgJoCE4BUSAKB7aMTNVTtQSoGhACjIzXwqRqByRKkCAcgICQoCaUJEoQBHHlxwEJZJqAPHHikKEnHz/VUDk6F+G3sTHnAkQTlQt/5n8qmKhH/Mt+E/RQThIQlkkKBUBJNCBSUoTUpQIUzjYnlRuKB4TgENCWlA2aCgo4/RAIQlKBqEqCgbNIlmmlAL0j0N2qi2WyzdKl7fAg/ILzddX6NbR6vyka3+ZCd5SP0KD3uGca0YTsCyobq6XLQszlA6LrqramVMVuKFC7UQU7DEo9mtKGMbVjxRTGwLSs0dr2NcgdGdEe+mE2r4e5Nh5xz4TWOc2px5wldwU+bmvz0LWStDmvbmoDXRG31VXTO3q2oJouCr3XU+U/quYjtrt8VvvTXSODmMxOqc5xLu3qWDDZncpR3dF3HyRYtwRQxWIRUMlJDRF2HqJ6ZC1E5yCtan4F5H6WLVRZoUD+ZE+S9Utz8C8Q9KNqqyxCgfy4c3d5/QoscQ5MKcSmgKoQoQUAKgCeE1OQSBCa0J01AhCh/Cf7qnUcXGgcCiSggvU4KAnxxx9GzTiU2aBUpKQJZoAlIhIqBIeOOPsskxxUCP1HJ6j16W+8pCFRJNQ/xm/CVMVGPxm/CfooJghCECBBSoQIE5IhAiY4KUphQEB2BPmoGYH/ABKdUNIShCRAqESSyUDZJEpSFA0hCWSRALT5M2ltl5Q5Pj9GKGu7HTb9VmSQHUYmazcTe0XoPpmwPrszVpWZywchx87Zmu6TQfETW1BKC+dRQFTsOBQnXUGfbG85PsGJ7cVPS8EtqUdiwRqea5FX4o6CdCjOob7qjcXMSwiiLBxLJyfDoz7uc6KfJaLjgVCyOwRf/cd80Imc1EMJycxqCxC1EsQoZqJkYoMrKb8C+fuWlp9a5SWx3Na+hvcL/OfivdcuR81BixXu1Wk+C+c7ZG9YtMWO/wDiRCfEzVVAU1OKaUQgSpEqBwTgmgJyB0kJAlQKoLS6himKpWh1b0DrM3nK1xxx+scJtLFJxxx9kAkQjjzQIAnJEqoQpErkgQB4/VMcE+SaUEY/GannSoz+M3vT0Euukb+M34T8wkYeanMGP8qglSFKkKASSSoKACVIghAskwpyagje1TNPOUbgiD0UEoSOQhAqSaRKgCmuCUlBQNkkKVBQJPnICQhBQe5+j+1+tZEsMXpQgHdrSWnzC7KGvL/RRaq8lZj+THcPGR+ZK9QYgvwSmxBjSQCnxQoKVsZgqTLCcbVYjitiq2I0WlFXHJsMqZ2JQ0oiR+os2xu9tHb/ANQrROosuzmi3x2+8g0GhTtFCZDapQgWahjuwKYqpajgQcX6QrX6vyetjuc6HQ3tNwXhbyvV/S3aqMmwLN/Mi+QBPzIXk5VgYkKVNQCUBIlkqHJwKaE4IFBTikCCFA2I6hipwhW9S2p3NRZmKidqUpENUClIgpJoFQgJSgQhNmlKCUCHjz44vQhKeOONHghKogecbU6abE1296WaglnjUsHXcoinwNdUTFIlmkUCBCEoQCCUICBSmzSoQNITNTEnlI4IJJpCUkNycgalQUhQKU1KUFAkkiVIgCmpUiDuvRXaqLfbIFWFzWxW9oJB+YXtUE4Gr575CWn1flJZm/zmuheLZjzAXv8Ak99Vma73UovwSp3aiqwirQ1FBBE1FTsw/eVdOoqUPBaVVXTgQ01pS7ppIYUQrlkQ8GUovGxbMQLHa3/iUXu+SK1YZUoVeGVZaiByoW12BXnrLyi/Ag8X9Ktr9Yy3As1X4MKrvJ+wXDuW1ywtfrvKG3RObnSxvYLvmFiFWBpSTRNHHHWgE6SQJwVChK08cdiQBOCgVJNLxsUUd9DEFaIa4ytQQqsFuNWwECgoQhATQkSoFkkKUFNJ444+aAKagBJNUOmkdqJU16CF+umpXpEFhxSwtdD0kE40FgIkhBUCEJSiaQoFCEImgQpShACBqE4pEDGmh/xKVQuCkYa2IFmkCWaQoAJClQgaiSVIgRIU4ppQW8kx/Vcq2OPq5uK090719FZCiV2anor5peNZvHF6+hOSFr9YscCJ/MhNf4tBPzQdO1WoZVUKzCUDCqQ/5xXnc5U2/wDMtVFt6WCmxPfTrOVBK8YFhxTTlJ3whbzlz9r/AOfQakBWgq1m1FZKBkQrnOUdq9VsFpj/AMuE5/gCV0MY4FwHpKtfq/Ji2dKNKC38xkfKaDxGPEdFe6I/Wc4vd2nSoVI4qJUIUTSFKqHAJUgSyQOHHHilSJxUACqVpdjpVmK6hlSqQxW9BYgMoYpUNCQoFB444vSJQkPHHH1QCUJEqAKaU4pqoSaJoKRAqa5OkmEoIX66bNK/XSILQchmu1I4JGHG1BaBQgIkoEShEkiBQgBIEoQCEpCRASSImhAhSQ9dKQmuw4kEk0iUFCBqUIKRAFIgoCBJISpCgavafRpas7kSw+7DLP6XEfReLOXqPootVdgdAq/DtLvMA/OaD1mGVZhKlCOBquwUCO13KqP+carTtdVWiu0tQWopam2VuNJaTmlG812aFEhOc3CS/uMpzHy61BeKwMoii3+C27K6JmW534au5YuVW0W/4pINSy6incVBZfwWqdyCC0OwLyP0xWv2NhsjHa0QxXdwIHzXq1sdgXhnpTtXrHKRsLmwYDW95JJ+iDi3KIp7kwrQAlCROkgUJyalkgcEJAke6higr2p+OlPszOPBQMFb6lcaECzQShNKBxKbx8kIAQKE4pJIJQITxx2JClKRUE02ackJUCHjzTClJTCUELzjckQiaoukKPntUjio3ILTSlKZDKcoFBQgHnIQCJpAnSQIkSyQgRLNIglAhSpEqBGHmpSm8+pPQIgFKAkKBEiUImgRIU5NKBhXdeim00W+2QPdZFb3Eg/MLhyF0no8j5jlJCb/ADILmd9xHyKD32A7A1X4JWbZHVMatCEqhXlV4J/eWqdyrQj++NUFq0NzvxNUbafVqacV9OIyM9M5aCFYis5yigP1vdv+h8lFLY4cWup+q2/Vl3CfzWXlw/vjfh+q36qlzuU8WUqexBrWT8Fqmco4Qpgtah5V4ijlB2BfOnKa2ev5eyhaelHc1vYDIeQ8173yitWYybaY38uE4+AJXzjGdVi5zsTu0oqJxUaeU0KhQlQEqACciSJKAVe1v5rFOXUqpDGdfUqJoDKFKgBKFAJpSpCgJpWpqeEBNIEpTSgU8ceKRBSqhOPmmOKVzlC9yBSVG84E0uqSOKgEIQqP/9k=", "gender": "", "address": "", "hireDate": "2024-02-01T00:00:00.000Z", "lastName": "Yilmaz", "workType": "FULL_TIME", "firstName": "Ayse", "nationalId": "22222222222", "positionId": "73704a3f-9dcc-4c29-ba98-d30baf7a280c", "dateOfBirth": "1992-03-03T00:00:00.000Z", "grossSalary": 45000, "departmentId": "41a3161e-e1af-417b-ba59-930be863d39f", "workLocation": "OFFICE", "emergencyContactName": "", "emergencyContactPhone": ""}	::ffff:127.0.0.1	2026-05-17 10:19:38.362+00	\N	\N	\N
78b96fa7-515c-49ab-9592-a6ac28a8b3c7	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	employees	0ac2c445-fd05-4e26-9db5-deda785f030b	\N	{"iban": "", "email": "ahmet.ates@erp.local", "phone": "5555555555", "photo": "data:image/jpeg;base64,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", "gender": "", "address": "", "hireDate": "2020-02-01T00:00:00.000Z", "lastName": "Ateş", "workType": "FULL_TIME", "firstName": "Ahmet", "managerId": "a29f4ac3-7a03-47ac-8b22-6d19135bde99", "nationalId": "11111111112", "positionId": "7fb9bdca-8ebf-4db1-b330-6b1ca174a402", "dateOfBirth": "1990-01-09T00:00:00.000Z", "grossSalary": 100000, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce", "workLocation": "OFFICE", "emergencyContactName": "", "emergencyContactPhone": ""}	::ffff:127.0.0.1	2026-05-17 10:22:25.557+00	\N	\N	\N
c5a83f57-10fa-43cb-983d-e62412bbc4df	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE_STATUS	employees	a29f4ac3-7a03-47ac-8b22-6d19135bde99	\N	{"status": "ACTIVE"}	::ffff:127.0.0.1	2026-05-17 10:26:26.015+00	\N	\N	\N
1ba1ee8a-5b20-4621-990f-326d21dd7786	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	positions	0c039f14-b36a-47b6-92ff-dc15499a107c	\N	{"level": 1, "title": "BT Direktörü", "isActive": true, "maxSalary": 0, "minSalary": 0, "description": "", "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce"}	::ffff:127.0.0.1	2026-05-17 10:27:03.87+00	\N	\N	\N
0d7f8fcc-e57d-4c9c-852f-52454e90e701	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	CREATE	employees	c9aa347b-2eed-4f21-9273-3682874fbe84	\N	{"iban": "", "role": "EMPLOYEE", "email": "veli.turk@erp.local", "phone": "5555555555", "photo": "", "gender": "MALE", "address": "", "hireDate": "2010-01-17T00:00:00.000Z", "lastName": "Türk", "password": "hopkop99!", "workType": "FULL_TIME", "firstName": "Veli", "managerId": "", "nationalId": "11111111114", "positionId": "0c039f14-b36a-47b6-92ff-dc15499a107c", "dateOfBirth": "1989-01-10T00:00:00.000Z", "grossSalary": 3000000, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce", "workLocation": "OFFICE", "emergencyContactName": "", "emergencyContactPhone": ""}	::ffff:127.0.0.1	2026-05-17 10:29:07.926+00	\N	\N	\N
7f3b8ee7-716b-41aa-801c-ebae9671a6e2	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	UPDATE	employees	a29f4ac3-7a03-47ac-8b22-6d19135bde99	\N	{"iban": "", "email": "ahmet.guler@erp.local", "phone": "5555555555", "photo": "data:image/jpeg;base64,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", "gender": "", "address": "", "hireDate": "2017-01-17T00:00:00.000Z", "lastName": "Güler", "workType": "FULL_TIME", "firstName": "Ahmet", "managerId": "c9aa347b-2eed-4f21-9273-3682874fbe84", "nationalId": "11111111113", "positionId": "c5adfcc0-c790-4efb-a209-36ef969709dc", "dateOfBirth": "1986-01-01T00:00:00.000Z", "grossSalary": 255000, "departmentId": "c2534ee6-fae9-4dee-a156-04abfae862ce", "workLocation": "OFFICE", "emergencyContactName": "", "emergencyContactPhone": ""}	::ffff:127.0.0.1	2026-05-17 10:29:29.281+00	\N	\N	\N
92a382e8-d022-4678-9520-77a26d4303d3	a6715dcf-0eee-49c5-b66d-00261bc30a57	CREATE	leaves	0ef0eef5-5a6c-48c2-b892-41f94baece8e	\N	{"reason": "genel izin kullanımı, yıllık izin", "endDate": "2026-05-20T00:00:00.000Z", "startDate": "2026-05-19T00:00:00.000Z", "leaveTypeId": "148724b4-5955-4645-a24a-9cf3d45f50f9"}	::ffff:127.0.0.1	2026-05-17 14:14:58.568+00	\N	\N	\N
f03f23af-be64-4a43-b219-5964ea1b6caa	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	APPROVE	leaves	0ef0eef5-5a6c-48c2-b892-41f94baece8e	\N	\N	::ffff:127.0.0.1	2026-05-17 14:15:31.985+00	\N	\N	\N
8f7a54e0-7efa-471e-b967-dc0202712939	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	RUN_PAYROLL	payrolls	\N	\N	{"year": 2026, "month": 5}	::ffff:127.0.0.1	2026-05-17 15:03:30.211+00	\N	\N	\N
\.


--
-- Data for Name: criterion_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.criterion_scores (id, evaluation_id, criterion_id, score, comment, scored_by, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, description, parent_id, is_active, created_at, updated_at, code, manager_id) FROM stdin;
41a3161e-e1af-417b-ba59-930be863d39f	Insan Kaynaklari	IK Departmani	\N	t	2026-05-16 22:17:20.304+00	2026-05-16 22:17:20.304+00	DEP-001	\N
c2534ee6-fae9-4dee-a156-04abfae862ce	Bilgi Teknolojileri	BT Departmani	\N	t	2026-05-16 22:17:20.33+00	2026-05-16 22:17:20.33+00	DEP-002	\N
36937236-26b5-45d9-a8fd-f3105051c2f6	Muhasebe		\N	t	2026-05-16 23:43:08.475+00	2026-05-16 23:43:08.475+00	DEP-003	\N
836eaa60-e769-4c11-a45e-dfbe21198baf	Finans	Finans	\N	t	2026-05-16 23:43:30.464+00	2026-05-16 23:43:30.464+00	DEP-004	\N
4a0e3957-2fbd-4767-91ed-0d022c189ee7	Lojistik	Lojistik	\N	t	2026-05-16 23:43:49.048+00	2026-05-16 23:43:49.048+00	DEP-005	\N
\.


--
-- Data for Name: employee_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_documents (id, employee_id, document_type, title, file_data, file_name, file_size, uploaded_by, expires_at, status, notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: employee_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_history (id, employee_id, change_type, field_name, old_value, new_value, changed_by, notes, created_at) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, first_name, last_name, national_id, email, phone, date_of_birth, hire_date, termination_date, status, department_id, position_id, manager_id, gross_salary, created_at, updated_at, employee_no, work_type, gender, address, iban, work_location, emergency_contact_name, emergency_contact_phone, photo) FROM stdin;
a61a6bc6-de47-4f47-8146-7979733f7088	System	Admin	11111111111	admin@erp.local	5551111111	1990-01-01	2024-01-01	\N	ACTIVE	41a3161e-e1af-417b-ba59-930be863d39f	73704a3f-9dcc-4c29-ba98-d30baf7a280c	\N	60000.00	2026-05-16 22:17:20.354+00	2026-05-16 22:17:20.354+00	EMP-0001	FULL_TIME	\N	\N	\N	OFFICE	\N	\N	\N
573b8fdf-360d-4253-9e5c-0e85e52a6ced	Mehmet	Kaya	33333333333	employee@erp.local	5553333333	1995-05-05	2024-04-01	\N	ACTIVE	c2534ee6-fae9-4dee-a156-04abfae862ce	7fb9bdca-8ebf-4db1-b330-6b1ca174a402	\N	35000.00	2026-05-16 22:17:20.366+00	2026-05-16 22:17:20.366+00	EMP-0003	FULL_TIME	\N	\N	\N	OFFICE	\N	\N	\N
36f918f1-8267-4ed3-bda3-aba7ccc86ea4	Ayse	Yilmaz	22222222222	hr@erp.local	5552222222	1992-03-03	2024-02-01	\N	ACTIVE	41a3161e-e1af-417b-ba59-930be863d39f	73704a3f-9dcc-4c29-ba98-d30baf7a280c	\N	45000.00	2026-05-16 22:17:20.361+00	2026-05-17 10:19:38.354+00	EMP-0002	FULL_TIME				OFFICE			data:image/jpeg;base64,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
0ac2c445-fd05-4e26-9db5-deda785f030b	Ahmet	Ateş	11111111112	ahmet.ates@erp.local	5555555555	1990-01-09	2020-02-01	\N	ACTIVE	c2534ee6-fae9-4dee-a156-04abfae862ce	7fb9bdca-8ebf-4db1-b330-6b1ca174a402	a29f4ac3-7a03-47ac-8b22-6d19135bde99	100000.00	2026-05-16 22:44:06.363+00	2026-05-17 10:22:25.548+00	EMP-0004	FULL_TIME				OFFICE			data:image/jpeg;base64,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
c9aa347b-2eed-4f21-9273-3682874fbe84	Veli	Türk	11111111114	veli.turk@erp.local	5555555555	1989-01-10	2010-01-17	\N	ACTIVE	c2534ee6-fae9-4dee-a156-04abfae862ce	0c039f14-b36a-47b6-92ff-dc15499a107c	\N	3000000.00	2026-05-17 10:29:07.809+00	2026-05-17 10:29:07.809+00	EMP-0006	FULL_TIME	MALE			OFFICE			\N
a29f4ac3-7a03-47ac-8b22-6d19135bde99	Ahmet	Güler	11111111113	ahmet.guler@erp.local	5555555555	1986-01-01	2017-01-17	2026-05-17	ACTIVE	c2534ee6-fae9-4dee-a156-04abfae862ce	c5adfcc0-c790-4efb-a209-36ef969709dc	c9aa347b-2eed-4f21-9273-3682874fbe84	255000.00	2026-05-16 22:52:02.882+00	2026-05-17 10:29:29.267+00	EMP-0005	FULL_TIME				OFFICE			data:image/jpeg;base64,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
\.


--
-- Data for Name: evaluation_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluation_periods (id, name, start_date, end_date, status, created_at, updated_at) FROM stdin;
8f38f299-aa33-401c-b23e-9248023855de	2026-Q1	2026-01-01	2026-03-31	ACTIVE	2026-05-16 23:56:22.343+00	2026-05-16 23:56:22.343+00
\.


--
-- Data for Name: evaluations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluations (id, employee_id, period_id, overall_score, manager_comment, status, created_at, updated_at, feedback, employee_comment, reviewer_id, strengths, improvement_areas) FROM stdin;
\.


--
-- Data for Name: goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.goals (id, employee_id, period_id, title, description, weight, self_score, manager_score, final_score, created_at, updated_at) FROM stdin;
2eaec670-46ab-4946-8970-241a4b416edf	c9aa347b-2eed-4f21-9273-3682874fbe84	8f38f299-aa33-401c-b23e-9248023855de	BT Bütçe Saving		25.00	\N	\N	\N	2026-05-17 14:11:38.856+00	2026-05-17 14:11:38.856+00
\.


--
-- Data for Name: leave_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_balances (id, employee_id, leave_type_id, year, total_days, used_days, remaining_days, created_at, updated_at) FROM stdin;
03bbe68b-eca2-4cb0-8643-9f0bdc8b94db	a29f4ac3-7a03-47ac-8b22-6d19135bde99	78fa9960-2a6b-455e-ae31-8d463de91c2c	2026	20.0	0.0	20.0	2026-05-16 23:10:01.863+00	2026-05-16 23:10:01.863+00
6172e71d-f497-43ee-aff8-00509165bee7	a29f4ac3-7a03-47ac-8b22-6d19135bde99	3cdf27a2-2a49-460e-a7a7-f64fa69e3445	2026	5.0	0.0	5.0	2026-05-16 23:10:01.867+00	2026-05-16 23:10:01.867+00
706d360c-07b1-4602-9603-5d772f69de60	a61a6bc6-de47-4f47-8146-7979733f7088	78fa9960-2a6b-455e-ae31-8d463de91c2c	2026	14.0	3.0	11.0	2026-05-16 23:20:28.591+00	2026-05-16 23:47:27.042+00
35ec3773-3caf-4044-b0dc-cf4d71950e1f	573b8fdf-360d-4253-9e5c-0e85e52a6ced	78fa9960-2a6b-455e-ae31-8d463de91c2c	2026	14.0	0.0	14.0	2026-05-17 00:50:28.625+00	2026-05-17 00:50:28.625+00
de56f62a-048c-4b8b-a485-dfd78de5393c	573b8fdf-360d-4253-9e5c-0e85e52a6ced	3cdf27a2-2a49-460e-a7a7-f64fa69e3445	2026	5.0	0.0	5.0	2026-05-17 00:50:28.64+00	2026-05-17 00:50:28.64+00
6b341373-fe65-4cec-998b-2f91e30551cd	a29f4ac3-7a03-47ac-8b22-6d19135bde99	c209b20a-7c0f-4ca5-b086-f5b575c4a422	2026	5.0	0.0	5.0	2026-05-17 09:44:45.01+00	2026-05-17 09:44:45.01+00
d466cb3b-bb79-4bbb-b694-77908d95e9e4	a29f4ac3-7a03-47ac-8b22-6d19135bde99	1ef8ebe7-9203-49cc-97d2-b5c4e44cffd1	2026	0.0	0.0	0.0	2026-05-17 09:44:45.014+00	2026-05-17 09:44:45.014+00
3953d34c-e639-477d-896b-036bb9578df6	a29f4ac3-7a03-47ac-8b22-6d19135bde99	148724b4-5955-4645-a24a-9cf3d45f50f9	2026	3.0	0.0	3.0	2026-05-17 09:44:45.019+00	2026-05-17 09:44:45.019+00
ec525d1d-172a-4cb9-80e0-faf2981816a8	a29f4ac3-7a03-47ac-8b22-6d19135bde99	5313fc3c-0594-40d4-ae06-e9520b2d34f3	2026	3.0	0.0	3.0	2026-05-17 09:44:45.021+00	2026-05-17 09:44:45.021+00
601d9adc-2b6b-40a6-a993-4b43fecf0444	a29f4ac3-7a03-47ac-8b22-6d19135bde99	68e3a5e1-765c-4c40-8a35-d9100767a701	2026	5.0	0.0	5.0	2026-05-17 09:44:45.023+00	2026-05-17 09:44:45.023+00
294e8d67-9ccf-4f94-8ca6-fafb84e59d9e	a29f4ac3-7a03-47ac-8b22-6d19135bde99	ae2943d8-ed60-47ba-8226-647783cd3c32	2026	112.0	0.0	112.0	2026-05-17 09:44:45.026+00	2026-05-17 09:44:45.026+00
62ac8922-3f73-4039-9d21-84be5b4c737e	a29f4ac3-7a03-47ac-8b22-6d19135bde99	c249cd8c-7394-46b6-8d26-d710d8362a2b	2026	5.0	0.0	5.0	2026-05-17 09:44:45.028+00	2026-05-17 09:44:45.028+00
47ea2eaf-ad7a-4f11-b528-5f5b56cdfbc6	0ac2c445-fd05-4e26-9db5-deda785f030b	78fa9960-2a6b-455e-ae31-8d463de91c2c	2026	0.0	0.0	0.0	2026-05-17 10:11:51.582+00	2026-05-17 10:11:51.582+00
91b2e756-500d-4990-bc6f-ded0508748eb	0ac2c445-fd05-4e26-9db5-deda785f030b	3cdf27a2-2a49-460e-a7a7-f64fa69e3445	2026	5.0	0.0	5.0	2026-05-17 10:11:51.593+00	2026-05-17 10:11:51.593+00
51ddeeb7-d174-41da-912c-794f7dce89f8	0ac2c445-fd05-4e26-9db5-deda785f030b	c209b20a-7c0f-4ca5-b086-f5b575c4a422	2026	5.0	0.0	5.0	2026-05-17 10:11:51.6+00	2026-05-17 10:11:51.6+00
074883e2-1974-4b1d-9f2d-bab1b1756abc	0ac2c445-fd05-4e26-9db5-deda785f030b	1ef8ebe7-9203-49cc-97d2-b5c4e44cffd1	2026	0.0	0.0	0.0	2026-05-17 10:11:51.603+00	2026-05-17 10:11:51.603+00
887c8554-b423-4c04-8911-578eb0f568be	0ac2c445-fd05-4e26-9db5-deda785f030b	5313fc3c-0594-40d4-ae06-e9520b2d34f3	2026	3.0	0.0	3.0	2026-05-17 10:11:51.609+00	2026-05-17 10:11:51.609+00
085e798c-2f82-458f-a03c-4a4edac118ff	0ac2c445-fd05-4e26-9db5-deda785f030b	68e3a5e1-765c-4c40-8a35-d9100767a701	2026	5.0	0.0	5.0	2026-05-17 10:11:51.612+00	2026-05-17 10:11:51.612+00
b30d031b-9228-40a7-84a0-6397bdc72fca	0ac2c445-fd05-4e26-9db5-deda785f030b	ae2943d8-ed60-47ba-8226-647783cd3c32	2026	112.0	0.0	112.0	2026-05-17 10:11:51.614+00	2026-05-17 10:11:51.614+00
e2fa02d8-a917-4e7e-b767-f79b649f0703	0ac2c445-fd05-4e26-9db5-deda785f030b	c249cd8c-7394-46b6-8d26-d710d8362a2b	2026	5.0	0.0	5.0	2026-05-17 10:11:51.616+00	2026-05-17 10:11:51.616+00
93bba6d8-33c8-462b-b1ce-2413c935718e	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	78fa9960-2a6b-455e-ae31-8d463de91c2c	2026	14.0	0.0	14.0	2026-05-17 10:19:30.44+00	2026-05-17 10:19:30.44+00
7f806253-ff07-4563-8321-7f9b85e62c0a	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	3cdf27a2-2a49-460e-a7a7-f64fa69e3445	2026	5.0	0.0	5.0	2026-05-17 10:19:30.447+00	2026-05-17 10:19:30.447+00
8978a2e3-04a9-4b2d-8c5d-5e7c86d10eff	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	c209b20a-7c0f-4ca5-b086-f5b575c4a422	2026	5.0	0.0	5.0	2026-05-17 10:19:30.45+00	2026-05-17 10:19:30.45+00
a4e68c22-9bb9-41bd-b5f1-a4374d435830	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	1ef8ebe7-9203-49cc-97d2-b5c4e44cffd1	2026	0.0	0.0	0.0	2026-05-17 10:19:30.452+00	2026-05-17 10:19:30.452+00
7be49cfb-138e-48d6-b2ba-c1fcee283caf	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	148724b4-5955-4645-a24a-9cf3d45f50f9	2026	3.0	0.0	3.0	2026-05-17 10:19:30.454+00	2026-05-17 10:19:30.454+00
549b2e33-bb6c-4695-8edd-4efd112470d3	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	5313fc3c-0594-40d4-ae06-e9520b2d34f3	2026	3.0	0.0	3.0	2026-05-17 10:19:30.458+00	2026-05-17 10:19:30.458+00
be7f256c-a7ed-4418-8728-e97f27776eda	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	68e3a5e1-765c-4c40-8a35-d9100767a701	2026	5.0	0.0	5.0	2026-05-17 10:19:30.46+00	2026-05-17 10:19:30.46+00
cf8b6f53-8ef9-41bd-8ff6-4be4df6c204a	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	ae2943d8-ed60-47ba-8226-647783cd3c32	2026	112.0	0.0	112.0	2026-05-17 10:19:30.462+00	2026-05-17 10:19:30.462+00
08f4f602-60bc-4e53-835e-89dd4c61012f	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	c249cd8c-7394-46b6-8d26-d710d8362a2b	2026	5.0	0.0	5.0	2026-05-17 10:19:30.464+00	2026-05-17 10:19:30.464+00
914888b6-6f28-45b5-8825-27475c134481	c9aa347b-2eed-4f21-9273-3682874fbe84	78fa9960-2a6b-455e-ae31-8d463de91c2c	2026	26.0	0.0	26.0	2026-05-17 10:30:24.436+00	2026-05-17 10:30:24.436+00
64026318-cce0-4938-ab85-c8b13e3827ca	c9aa347b-2eed-4f21-9273-3682874fbe84	3cdf27a2-2a49-460e-a7a7-f64fa69e3445	2026	5.0	0.0	5.0	2026-05-17 10:30:24.446+00	2026-05-17 10:30:24.446+00
5501d549-9f85-4169-90de-f5f4f3a76904	c9aa347b-2eed-4f21-9273-3682874fbe84	c209b20a-7c0f-4ca5-b086-f5b575c4a422	2026	5.0	0.0	5.0	2026-05-17 10:30:24.452+00	2026-05-17 10:30:24.452+00
e157e260-59ac-4b71-bcdc-436df0084e19	c9aa347b-2eed-4f21-9273-3682874fbe84	1ef8ebe7-9203-49cc-97d2-b5c4e44cffd1	2026	0.0	0.0	0.0	2026-05-17 10:30:24.456+00	2026-05-17 10:30:24.456+00
2d8d5a6e-c83f-4c80-9953-24fb573c63c9	c9aa347b-2eed-4f21-9273-3682874fbe84	148724b4-5955-4645-a24a-9cf3d45f50f9	2026	3.0	0.0	3.0	2026-05-17 10:30:24.459+00	2026-05-17 10:30:24.459+00
b6e5d695-0641-498a-94e9-f91b8de9c2a8	c9aa347b-2eed-4f21-9273-3682874fbe84	5313fc3c-0594-40d4-ae06-e9520b2d34f3	2026	3.0	0.0	3.0	2026-05-17 10:30:24.462+00	2026-05-17 10:30:24.462+00
f583e5cd-9b89-4825-bac6-5aed2b17d899	c9aa347b-2eed-4f21-9273-3682874fbe84	68e3a5e1-765c-4c40-8a35-d9100767a701	2026	5.0	0.0	5.0	2026-05-17 10:30:24.464+00	2026-05-17 10:30:24.464+00
bd27ebe6-571d-46af-abe7-654ec6882636	c9aa347b-2eed-4f21-9273-3682874fbe84	ae2943d8-ed60-47ba-8226-647783cd3c32	2026	112.0	0.0	112.0	2026-05-17 10:30:24.466+00	2026-05-17 10:30:24.466+00
5b0f28d7-751a-4906-a0d6-0bc1e68ae90b	c9aa347b-2eed-4f21-9273-3682874fbe84	c249cd8c-7394-46b6-8d26-d710d8362a2b	2026	5.0	0.0	5.0	2026-05-17 10:30:24.469+00	2026-05-17 10:30:24.469+00
9c16b13e-0673-45c5-8d2b-4e778ae06d65	0ac2c445-fd05-4e26-9db5-deda785f030b	148724b4-5955-4645-a24a-9cf3d45f50f9	2026	3.0	2.0	1.0	2026-05-17 10:11:51.606+00	2026-05-17 14:15:31.981+00
\.


--
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leave_types (id, name, default_days, is_paid, requires_approval, created_at, updated_at) FROM stdin;
78fa9960-2a6b-455e-ae31-8d463de91c2c	Yillik Izin	14	t	t	2026-05-16 22:17:20.652+00	2026-05-16 22:17:20.652+00
3cdf27a2-2a49-460e-a7a7-f64fa69e3445	Mazeret Izni	5	t	t	2026-05-16 22:17:20.657+00	2026-05-16 22:17:20.657+00
c209b20a-7c0f-4ca5-b086-f5b575c4a422	Hastalik Izni	5	t	t	2026-05-17 01:00:28.399219+00	2026-05-17 01:00:28.399219+00
1ef8ebe7-9203-49cc-97d2-b5c4e44cffd1	Ucretsiz Izin	0	f	t	2026-05-17 01:00:28.400757+00	2026-05-17 01:00:28.400757+00
148724b4-5955-4645-a24a-9cf3d45f50f9	Evlilik Izni	3	t	t	2026-05-17 01:00:28.401283+00	2026-05-17 01:00:28.401283+00
5313fc3c-0594-40d4-ae06-e9520b2d34f3	Olum Izni	3	t	t	2026-05-17 01:00:28.401821+00	2026-05-17 01:00:28.401821+00
68e3a5e1-765c-4c40-8a35-d9100767a701	Babalik Izni	5	t	t	2026-05-17 01:00:28.402386+00	2026-05-17 01:00:28.402386+00
ae2943d8-ed60-47ba-8226-647783cd3c32	Dogum Izni	112	t	t	2026-05-17 01:00:28.402957+00	2026-05-17 01:00:28.402957+00
c249cd8c-7394-46b6-8d26-d710d8362a2b	Idari Izin	5	t	f	2026-05-17 01:00:28.403487+00	2026-05-17 01:00:28.403487+00
\.


--
-- Data for Name: leaves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.leaves (id, employee_id, leave_type_id, start_date, end_date, total_days, reason, status, approved_by, approved_at, rejection_reason, created_at, updated_at, manager_approver_id, hr_approver_id, business_days, manager_approved_at, hr_approved_at) FROM stdin;
fb525bf7-799a-4a26-b5aa-6bc6ab499370	a61a6bc6-de47-4f47-8146-7979733f7088	78fa9960-2a6b-455e-ae31-8d463de91c2c	2026-03-01	2026-03-03	3.0		APPROVED	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	2026-05-16 23:47:27.047+00	\N	2026-05-16 23:20:28.595+00	2026-05-16 23:47:27.048+00	\N	\N	\N	\N	\N
0ef0eef5-5a6c-48c2-b892-41f94baece8e	0ac2c445-fd05-4e26-9db5-deda785f030b	148724b4-5955-4645-a24a-9cf3d45f50f9	2026-05-19	2026-05-20	2.0	genel izin kullanımı, yıllık izin	APPROVED	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	2026-05-17 14:15:31.983+00	\N	2026-05-17 14:14:58.559+00	2026-05-17 14:15:31.983+00	\N	\N	\N	\N	\N
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, message, type, module, entity_type, entity_id, is_read, read_at, created_at) FROM stdin;
\.


--
-- Data for Name: payroll_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payroll_items (id, payroll_id, item_type, item_name, amount, created_at, updated_at) FROM stdin;
bd8ac463-31ce-4116-b954-2955f1c4e88c	1b214663-f9eb-4761-8644-f1f825d85777	EARNING	Brut Maas	44999.00	2026-05-17 02:44:31.216+00	2026-05-17 02:44:31.216+00
ca1147b9-84ad-403c-b549-b33c8b7bf123	1b214663-f9eb-4761-8644-f1f825d85777	EARNING	Ek Odeme	10000.00	2026-05-17 02:44:31.218+00	2026-05-17 02:44:31.218+00
27909d56-9f42-4e46-842f-874d6bcd1281	1b214663-f9eb-4761-8644-f1f825d85777	EARNING	Fazla Mesai	10000.00	2026-05-17 02:44:31.219+00	2026-05-17 02:44:31.219+00
d2b2aeb9-23eb-4cad-a850-c48d68bc18c8	1b214663-f9eb-4761-8644-f1f825d85777	EARNING	Yol Yardimi	5000.00	2026-05-17 02:44:31.22+00	2026-05-17 02:44:31.22+00
fc40d373-7955-4a33-b1c2-d8c4ff3ad68b	1b214663-f9eb-4761-8644-f1f825d85777	EARNING	Yemek Yardimi	11997.00	2026-05-17 02:44:31.221+00	2026-05-17 02:44:31.221+00
ef15d4de-0146-4225-9969-5b983e41a64b	1b214663-f9eb-4761-8644-f1f825d85777	DEDUCTION	SGK Isci Primi	11479.44	2026-05-17 02:44:31.222+00	2026-05-17 02:44:31.222+00
583677ea-c855-489b-9406-644238a3720d	1b214663-f9eb-4761-8644-f1f825d85777	DEDUCTION	Issizlik Isci Payi	819.96	2026-05-17 02:44:31.224+00	2026-05-17 02:44:31.224+00
a2927abd-8698-49ae-a7d2-86f075651e78	1b214663-f9eb-4761-8644-f1f825d85777	DEDUCTION	Gelir Vergisi	10454.49	2026-05-17 02:44:31.225+00	2026-05-17 02:44:31.225+00
1b309c84-5d8c-4658-a9c9-9d5ffbbd2145	1b214663-f9eb-4761-8644-f1f825d85777	DEDUCTION	Damga Vergisi	622.35	2026-05-17 02:44:31.226+00	2026-05-17 02:44:31.226+00
f8391823-9359-40b2-8582-cf9d023b7914	1b214663-f9eb-4761-8644-f1f825d85777	DEDUCTION	BES Kesintisi	2000.00	2026-05-17 02:44:31.227+00	2026-05-17 02:44:31.227+00
9efd99ab-dc20-44e4-9d9d-55bc9c1f1542	1b214663-f9eb-4761-8644-f1f825d85777	EMPLOYER	SGK Isveren Primi	16809.18	2026-05-17 02:44:31.228+00	2026-05-17 02:44:31.228+00
319d7c63-f212-45d0-a00b-83f8fbeb534b	1b214663-f9eb-4761-8644-f1f825d85777	EMPLOYER	Issizlik Isveren Primi	1639.92	2026-05-17 02:44:31.229+00	2026-05-17 02:44:31.229+00
d1c6a4dc-61c7-4161-9cb5-b3729a51183c	f9685461-8738-41bc-8ec0-052259e15f38	EARNING	Brut Maas	60000.00	2026-05-17 15:03:30.058+00	2026-05-17 15:03:30.058+00
fa6251d9-2485-46b1-8224-76a0158e1514	f9685461-8738-41bc-8ec0-052259e15f38	DEDUCTION	SGK Isci Primi	8400.00	2026-05-17 15:03:30.061+00	2026-05-17 15:03:30.061+00
3ded9975-55da-4507-a85b-3b832def12fc	f9685461-8738-41bc-8ec0-052259e15f38	DEDUCTION	Issizlik Isci Payi	600.00	2026-05-17 15:03:30.063+00	2026-05-17 15:03:30.063+00
3d394bf4-db74-431c-a7c9-c8d154ab4d4a	f9685461-8738-41bc-8ec0-052259e15f38	DEDUCTION	Gelir Vergisi	7650.00	2026-05-17 15:03:30.065+00	2026-05-17 15:03:30.065+00
6d51f65f-92d1-4d76-b25d-c9d84a316cfd	f9685461-8738-41bc-8ec0-052259e15f38	DEDUCTION	Damga Vergisi	455.40	2026-05-17 15:03:30.067+00	2026-05-17 15:03:30.067+00
ef8da240-bb54-4157-90ec-f14da5fba0a3	f9685461-8738-41bc-8ec0-052259e15f38	EMPLOYER	SGK Isveren Primi	12300.00	2026-05-17 15:03:30.07+00	2026-05-17 15:03:30.07+00
e5b736db-56c6-4a02-91de-efa7cca53f18	f9685461-8738-41bc-8ec0-052259e15f38	EMPLOYER	Issizlik Isveren Primi	1200.00	2026-05-17 15:03:30.072+00	2026-05-17 15:03:30.072+00
94a5c398-dcb4-4880-8a54-34a32f18b1e2	eb65ca88-e2dc-4704-bbde-a11fedaf1913	EARNING	Brut Maas	35000.00	2026-05-17 15:03:30.092+00	2026-05-17 15:03:30.092+00
491b61a9-e3d1-45e3-a79d-82f0e200e3b9	eb65ca88-e2dc-4704-bbde-a11fedaf1913	DEDUCTION	SGK Isci Primi	4900.00	2026-05-17 15:03:30.094+00	2026-05-17 15:03:30.094+00
91f8b90b-f889-42b9-86f2-c239d5fa579c	eb65ca88-e2dc-4704-bbde-a11fedaf1913	DEDUCTION	Issizlik Isci Payi	350.00	2026-05-17 15:03:30.096+00	2026-05-17 15:03:30.096+00
51ff7ef4-0697-47a1-bbd5-0d1fb08c91df	eb65ca88-e2dc-4704-bbde-a11fedaf1913	DEDUCTION	Gelir Vergisi	4462.50	2026-05-17 15:03:30.098+00	2026-05-17 15:03:30.098+00
a78c892f-77da-4c81-b4b6-530d8054367f	eb65ca88-e2dc-4704-bbde-a11fedaf1913	DEDUCTION	Damga Vergisi	265.65	2026-05-17 15:03:30.099+00	2026-05-17 15:03:30.099+00
67610ab1-95b5-458c-9a1c-2c4315a1ac9a	eb65ca88-e2dc-4704-bbde-a11fedaf1913	EMPLOYER	SGK Isveren Primi	7175.00	2026-05-17 15:03:30.101+00	2026-05-17 15:03:30.101+00
34f2f7be-d8e7-477d-bd18-c0ac2eafcd23	eb65ca88-e2dc-4704-bbde-a11fedaf1913	EMPLOYER	Issizlik Isveren Primi	700.00	2026-05-17 15:03:30.103+00	2026-05-17 15:03:30.103+00
b4046e9c-b4c7-4383-8d67-8b5390d8b5bf	bbbe2064-8e01-42af-a973-bf0b5e849038	EARNING	Brut Maas	45000.00	2026-05-17 15:03:30.118+00	2026-05-17 15:03:30.118+00
9f9792a8-21d9-4a16-b40e-21f5e3441aff	bbbe2064-8e01-42af-a973-bf0b5e849038	DEDUCTION	SGK Isci Primi	6300.00	2026-05-17 15:03:30.119+00	2026-05-17 15:03:30.119+00
9694bcad-2964-4414-8830-8bae4145ee21	bbbe2064-8e01-42af-a973-bf0b5e849038	DEDUCTION	Issizlik Isci Payi	450.00	2026-05-17 15:03:30.121+00	2026-05-17 15:03:30.121+00
74542f47-724e-4b0a-8f4a-513e191f0fe8	bbbe2064-8e01-42af-a973-bf0b5e849038	DEDUCTION	Gelir Vergisi	5737.50	2026-05-17 15:03:30.122+00	2026-05-17 15:03:30.122+00
26530ed4-2156-4467-a46e-27c7acbdd3fa	bbbe2064-8e01-42af-a973-bf0b5e849038	DEDUCTION	Damga Vergisi	341.55	2026-05-17 15:03:30.123+00	2026-05-17 15:03:30.123+00
f039b1f0-6fc8-444b-9413-2863563efd2c	bbbe2064-8e01-42af-a973-bf0b5e849038	EMPLOYER	SGK Isveren Primi	9225.00	2026-05-17 15:03:30.125+00	2026-05-17 15:03:30.125+00
cb12038a-d8cf-4848-a68f-0c4fab83ce67	bbbe2064-8e01-42af-a973-bf0b5e849038	EMPLOYER	Issizlik Isveren Primi	900.00	2026-05-17 15:03:30.126+00	2026-05-17 15:03:30.126+00
40ca318d-53a4-4721-883d-bd6d99a27c04	e23024d1-11c5-4a41-ac85-d2871cbe4b20	EARNING	Brut Maas	100000.00	2026-05-17 15:03:30.142+00	2026-05-17 15:03:30.142+00
92369f6d-ac75-4d72-ab8d-c0f9f702b11e	e23024d1-11c5-4a41-ac85-d2871cbe4b20	DEDUCTION	SGK Isci Primi	14000.00	2026-05-17 15:03:30.143+00	2026-05-17 15:03:30.143+00
a08cd50c-78a2-48cd-92dd-7a619ced2f87	e23024d1-11c5-4a41-ac85-d2871cbe4b20	DEDUCTION	Issizlik Isci Payi	1000.00	2026-05-17 15:03:30.145+00	2026-05-17 15:03:30.145+00
b1d07c89-db5a-47f8-84b7-c37ca9ab699e	e23024d1-11c5-4a41-ac85-d2871cbe4b20	DEDUCTION	Gelir Vergisi	12750.00	2026-05-17 15:03:30.146+00	2026-05-17 15:03:30.146+00
46e61a0d-d186-4014-8131-4e7b73a4c16f	e23024d1-11c5-4a41-ac85-d2871cbe4b20	DEDUCTION	Damga Vergisi	759.00	2026-05-17 15:03:30.147+00	2026-05-17 15:03:30.147+00
f5e8cb90-ce29-40be-89e8-b843e1c0d049	e23024d1-11c5-4a41-ac85-d2871cbe4b20	EMPLOYER	SGK Isveren Primi	20500.00	2026-05-17 15:03:30.149+00	2026-05-17 15:03:30.149+00
7a2a33d3-1e7a-4570-8676-a910dc584c4a	e23024d1-11c5-4a41-ac85-d2871cbe4b20	EMPLOYER	Issizlik Isveren Primi	2000.00	2026-05-17 15:03:30.15+00	2026-05-17 15:03:30.15+00
af6cd691-3b15-4aa6-9238-3e6437f1d04d	758a057f-1f3d-46cb-8b9a-ee82414c3045	EARNING	Brut Maas	3000000.00	2026-05-17 15:03:30.167+00	2026-05-17 15:03:30.167+00
1f6e3a34-7185-4d65-aa2b-8ba8a89ccc1a	758a057f-1f3d-46cb-8b9a-ee82414c3045	DEDUCTION	SGK Isci Primi	420000.00	2026-05-17 15:03:30.168+00	2026-05-17 15:03:30.168+00
f80c2c9c-71d9-41f9-989a-20f7b4730ac1	758a057f-1f3d-46cb-8b9a-ee82414c3045	DEDUCTION	Issizlik Isci Payi	30000.00	2026-05-17 15:03:30.17+00	2026-05-17 15:03:30.17+00
0b412b29-fd06-4bd6-a56b-9b8a61803f10	758a057f-1f3d-46cb-8b9a-ee82414c3045	DEDUCTION	Gelir Vergisi	382500.00	2026-05-17 15:03:30.171+00	2026-05-17 15:03:30.171+00
a6e09a4e-f7f0-4779-979b-1d9d90d41238	758a057f-1f3d-46cb-8b9a-ee82414c3045	DEDUCTION	Damga Vergisi	22770.00	2026-05-17 15:03:30.173+00	2026-05-17 15:03:30.173+00
f94578e3-b57d-42b6-badc-c17d946dfb6f	758a057f-1f3d-46cb-8b9a-ee82414c3045	EMPLOYER	SGK Isveren Primi	615000.00	2026-05-17 15:03:30.174+00	2026-05-17 15:03:30.174+00
e4e4c337-75a5-4515-8d8a-604614bf61e0	758a057f-1f3d-46cb-8b9a-ee82414c3045	EMPLOYER	Issizlik Isveren Primi	60000.00	2026-05-17 15:03:30.175+00	2026-05-17 15:03:30.175+00
ff10d56d-16d7-4ec3-8658-d065bb26f7a6	c8d3f656-5a9f-4199-9e3d-2924d7479f58	EARNING	Brut Maas	255000.00	2026-05-17 15:03:30.193+00	2026-05-17 15:03:30.193+00
7793d99f-094a-4c32-bbf8-8b8fa4a91778	c8d3f656-5a9f-4199-9e3d-2924d7479f58	DEDUCTION	SGK Isci Primi	35700.00	2026-05-17 15:03:30.194+00	2026-05-17 15:03:30.194+00
4fce0723-9572-4edb-ae1c-d918f69849f7	c8d3f656-5a9f-4199-9e3d-2924d7479f58	DEDUCTION	Issizlik Isci Payi	2550.00	2026-05-17 15:03:30.195+00	2026-05-17 15:03:30.195+00
4877a031-9653-4f37-a381-de6f7d4bd7fa	c8d3f656-5a9f-4199-9e3d-2924d7479f58	DEDUCTION	Gelir Vergisi	32512.50	2026-05-17 15:03:30.197+00	2026-05-17 15:03:30.197+00
d3d6607f-8e10-4060-85cd-b7a1665c1027	c8d3f656-5a9f-4199-9e3d-2924d7479f58	DEDUCTION	Damga Vergisi	1935.45	2026-05-17 15:03:30.199+00	2026-05-17 15:03:30.199+00
f27cc07b-e64f-4f14-b478-465c8d087c41	c8d3f656-5a9f-4199-9e3d-2924d7479f58	EMPLOYER	SGK Isveren Primi	52275.00	2026-05-17 15:03:30.2+00	2026-05-17 15:03:30.2+00
a623732a-d792-4f97-8853-15d874486bea	c8d3f656-5a9f-4199-9e3d-2924d7479f58	EMPLOYER	Issizlik Isveren Primi	5100.00	2026-05-17 15:03:30.201+00	2026-05-17 15:03:30.201+00
\.


--
-- Data for Name: payroll_parameters; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payroll_parameters (id, parameter_name, parameter_value, year, description, is_active, created_at, updated_at) FROM stdin;
e4413658-5208-4ca3-a31e-10e0b2401798	employee_sgk_rate	0.14000	2024	SGK isci primi orani	t	2026-05-16 23:31:54.728081+00	2026-05-16 23:31:54.728081+00
6f15c9e0-57b6-4d78-bb89-caf97ef36979	employee_unemployment_rate	0.01000	2024	Issizlik isci primi orani	t	2026-05-16 23:31:54.731268+00	2026-05-16 23:31:54.731268+00
9783da7e-eb38-4845-89d1-0eaa948affb0	employer_sgk_rate	0.20500	2024	SGK isveren primi orani	t	2026-05-16 23:31:54.732328+00	2026-05-16 23:31:54.732328+00
cd596696-05c4-4a54-80aa-0354fde6d302	employer_unemployment_rate	0.02000	2024	Issizlik isveren primi orani	t	2026-05-16 23:31:54.733709+00	2026-05-16 23:31:54.733709+00
73b63d7a-3bb9-4ad1-88d8-44b613559bf2	income_tax_rate	0.15000	2024	Gelir vergisi orani	t	2026-05-16 23:31:54.734653+00	2026-05-16 23:31:54.734653+00
af33d09a-8233-423b-81fc-92908a0b6b55	stamp_tax_rate	0.00759	2024	Damga vergisi orani	t	2026-05-16 23:31:54.735634+00	2026-05-16 23:31:54.735634+00
b7c5d93b-ca61-4183-8f01-f3a4cd77e837	employee_sgk_rate	0.14000	2026	SGK isci primi orani	t	2026-05-16 23:31:54.737169+00	2026-05-16 23:31:54.737169+00
c9458d17-6eae-4cff-afb0-d2929a19b874	employee_unemployment_rate	0.01000	2026	Issizlik isci primi orani	t	2026-05-16 23:31:54.737169+00	2026-05-16 23:31:54.737169+00
b8046099-024b-421e-b83a-c22aa22b2e7b	employer_sgk_rate	0.20500	2026	SGK isveren primi orani	t	2026-05-16 23:31:54.737169+00	2026-05-16 23:31:54.737169+00
044cb45c-ee66-441f-8604-b35357a8fd9b	employer_unemployment_rate	0.02000	2026	Issizlik isveren primi orani	t	2026-05-16 23:31:54.737169+00	2026-05-16 23:31:54.737169+00
12c6e1a8-6292-4338-9aa1-98221d52251a	income_tax_rate	0.15000	2026	Gelir vergisi orani	t	2026-05-16 23:31:54.737169+00	2026-05-16 23:31:54.737169+00
870c291d-ec21-4224-91eb-6f6b601a5c84	stamp_tax_rate	0.00759	2026	Damga vergisi orani	t	2026-05-16 23:31:54.737169+00	2026-05-16 23:31:54.737169+00
\.


--
-- Data for Name: payrolls; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payrolls (id, employee_id, period_month, period_year, gross_salary, net_salary, total_deductions, total_additions, status, calculated_at, created_at, updated_at, bonus_payment, overtime_payment, transportation_allowance, meal_allowance, other_earnings, total_gross_earnings, employee_sgk_premium, employee_unemployment_premium, income_tax_base, income_tax, stamp_tax, bes_deduction, advance_deduction, enforcement_deduction, other_deductions, employer_sgk_premium, employer_unemployment_premium, total_employer_cost, approved_by, approved_at) FROM stdin;
1b214663-f9eb-4761-8644-f1f825d85777	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	4	2026	44999.00	56619.76	25376.24	36997.00	CALCULATED	2026-05-17 02:44:31.212+00	2026-05-17 02:44:31.213+00	2026-05-17 02:44:31.213+00	10000.00	10000.00	5000.00	11997.00	0.00	81996.00	11479.44	819.96	69696.60	10454.49	622.35	2000.00	0.00	0.00	0.00	16809.18	1639.92	100445.10	\N	\N
f9685461-8738-41bc-8ec0-052259e15f38	a61a6bc6-de47-4f47-8146-7979733f7088	5	2026	60000.00	42894.60	17105.40	0.00	CALCULATED	2026-05-17 15:03:30.045+00	2026-05-17 15:03:30.048+00	2026-05-17 15:03:30.048+00	0.00	0.00	0.00	0.00	0.00	60000.00	8400.00	600.00	51000.00	7650.00	455.40	0.00	0.00	0.00	0.00	12300.00	1200.00	73500.00	\N	\N
eb65ca88-e2dc-4704-bbde-a11fedaf1913	573b8fdf-360d-4253-9e5c-0e85e52a6ced	5	2026	35000.00	25021.85	9978.15	0.00	CALCULATED	2026-05-17 15:03:30.088+00	2026-05-17 15:03:30.089+00	2026-05-17 15:03:30.089+00	0.00	0.00	0.00	0.00	0.00	35000.00	4900.00	350.00	29750.00	4462.50	265.65	0.00	0.00	0.00	0.00	7175.00	700.00	42875.00	\N	\N
bbbe2064-8e01-42af-a973-bf0b5e849038	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	5	2026	45000.00	32170.95	12829.05	0.00	CALCULATED	2026-05-17 15:03:30.115+00	2026-05-17 15:03:30.115+00	2026-05-17 15:03:30.115+00	0.00	0.00	0.00	0.00	0.00	45000.00	6300.00	450.00	38250.00	5737.50	341.55	0.00	0.00	0.00	0.00	9225.00	900.00	55125.00	\N	\N
e23024d1-11c5-4a41-ac85-d2871cbe4b20	0ac2c445-fd05-4e26-9db5-deda785f030b	5	2026	100000.00	71491.00	28509.00	0.00	CALCULATED	2026-05-17 15:03:30.139+00	2026-05-17 15:03:30.139+00	2026-05-17 15:03:30.139+00	0.00	0.00	0.00	0.00	0.00	100000.00	14000.00	1000.00	85000.00	12750.00	759.00	0.00	0.00	0.00	0.00	20500.00	2000.00	122500.00	\N	\N
758a057f-1f3d-46cb-8b9a-ee82414c3045	c9aa347b-2eed-4f21-9273-3682874fbe84	5	2026	3000000.00	2144730.00	855270.00	0.00	CALCULATED	2026-05-17 15:03:30.164+00	2026-05-17 15:03:30.164+00	2026-05-17 15:03:30.164+00	0.00	0.00	0.00	0.00	0.00	3000000.00	420000.00	30000.00	2550000.00	382500.00	22770.00	0.00	0.00	0.00	0.00	615000.00	60000.00	3675000.00	\N	\N
c8d3f656-5a9f-4199-9e3d-2924d7479f58	a29f4ac3-7a03-47ac-8b22-6d19135bde99	5	2026	255000.00	182302.05	72697.95	0.00	CALCULATED	2026-05-17 15:03:30.186+00	2026-05-17 00:34:24.119+00	2026-05-17 15:03:30.187+00	0.00	0.00	0.00	0.00	0.00	255000.00	35700.00	2550.00	216750.00	32512.50	1935.45	0.00	0.00	0.00	0.00	52275.00	5100.00	312375.00	\N	\N
\.


--
-- Data for Name: performance_criteria; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.performance_criteria (id, name, description, weight, is_active, created_at, updated_at) FROM stdin;
ac414dfb-bcd9-4ea9-8d63-a2f6761d34a3	Is Kalitesi	Yapilan isin dogrulugu, eksiksizligi ve standartlara uygunlugu	20.00	t	2026-05-17 01:07:28.100111+00	2026-05-17 01:07:28.100111+00
246f5f42-8dec-4461-839e-69c9a909ae33	Zamaninda Teslim	Verilen gorevlerin belirlenen sure icinde tamamlanmasi	20.00	t	2026-05-17 01:07:28.10123+00	2026-05-17 01:07:28.10123+00
0cc7beba-67cc-4293-936e-206f8989e43b	Takim Calismasi	Ekip uyesi olarak isbirligi ve katki duzeyi	20.00	t	2026-05-17 01:07:28.101677+00	2026-05-17 01:07:28.101677+00
55b05d92-ce83-495c-a7d5-d1827cce3a7a	Iletisim	Sozlu ve yazili iletisim becerileri, geri bildirim alma/verme	20.00	t	2026-05-17 01:07:28.102189+00	2026-05-17 01:07:28.102189+00
0c1dad44-5798-4c25-95cf-836b28da297f	Hedef Gerceklestirme	Belirlenen hedef ve KPI lara ulasilma duzeyi	20.00	t	2026-05-17 01:07:28.102637+00	2026-05-17 01:07:28.102637+00
\.


--
-- Data for Name: positions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.positions (id, title, level, department_id, created_at, updated_at, description, min_salary, max_salary, is_active, position_code, job_level) FROM stdin;
73704a3f-9dcc-4c29-ba98-d30baf7a280c	HR Manager	5	41a3161e-e1af-417b-ba59-930be863d39f	2026-05-16 22:17:20.338+00	2026-05-16 22:17:20.338+00	\N	0.00	0.00	t	POS-001	SPECIALIST
7fb9bdca-8ebf-4db1-b330-6b1ca174a402	Software Specialist	3	c2534ee6-fae9-4dee-a156-04abfae862ce	2026-05-16 22:17:20.344+00	2026-05-16 22:17:20.344+00	\N	0.00	0.00	t	POS-002	SPECIALIST
c5adfcc0-c790-4efb-a209-36ef969709dc	IT Manager	6	c2534ee6-fae9-4dee-a156-04abfae862ce	2026-05-16 23:50:44.511+00	2026-05-16 23:53:18.532+00	\N	0.00	0.00	t	POS-003	SPECIALIST
3a3c0944-7682-4f2d-a1ab-5d85cbc2863c	Ön Muhasebe	1	36937236-26b5-45d9-a8fd-f3105051c2f6	2026-05-16 23:50:59.426+00	2026-05-16 23:50:59.426+00	\N	0.00	0.00	t	POS-004	SPECIALIST
0206ca46-47f1-41a7-adcc-2dcba8e42393	Genel Müdür	1	836eaa60-e769-4c11-a45e-dfbe21198baf	2026-05-16 23:51:17.265+00	2026-05-16 23:51:17.265+00	\N	0.00	0.00	t	POS-005	SPECIALIST
0c039f14-b36a-47b6-92ff-dc15499a107c	BT Direktörü	1	c2534ee6-fae9-4dee-a156-04abfae862ce	2026-05-17 10:27:03.866+00	2026-05-17 10:27:03.866+00		0.00	0.00	t	\N	SPECIALIST
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (id, user_id, token, expires_at, revoked, created_at, updated_at) FROM stdin;
2c03413c-0726-4332-b252-c66566f6a85a	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcxMDkwLCJleHAiOjE3Nzk1NzU4OTB9.4EPNJr_0jA2mJejWPNeqKXH0IFTnmJH0X1NjMt3fwUI	2026-05-23 22:38:10.893+00	f	2026-05-16 22:38:10.894+00	2026-05-16 22:38:10.894+00
9679f949-978e-42d1-869a-6f76a9d56bbe	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcxMTQzLCJleHAiOjE3Nzk1NzU5NDN9.E7HT_BjU1wr97bqYNO_7Obhn5LsFXdM6G5dCdI7_uA4	2026-05-23 22:39:03.91+00	f	2026-05-16 22:39:03.91+00	2026-05-16 22:39:03.91+00
a48fcdc6-14f0-4ad4-846f-f3f175df1e26	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcxMjY0LCJleHAiOjE3Nzk1NzYwNjR9.8sZCekZYv5zE15_DwrX1ugCxSDyrLdKM0NHGpcVbg20	2026-05-23 22:41:04.31+00	f	2026-05-16 22:41:04.311+00	2026-05-16 22:41:04.311+00
346f77fa-1fb0-468b-bee6-f89eba8adbf8	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcyMTc4LCJleHAiOjE3Nzk1NzY5Nzh9.nGdW2Sv6w6rLVv1tYcs5cGI_2_w1BXOURGFShnSZGS0	2026-05-23 22:56:18.746+00	f	2026-05-16 22:56:18.746+00	2026-05-16 22:56:18.746+00
2caee8b8-e174-4f40-8ea7-8d89fc602e73	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcyMzUxLCJleHAiOjE3Nzk1NzcxNTF9.q8zIz5CfWCApfzVIz-MLkR5JRhnRWRSck6dGKSXKCzw	2026-05-23 22:59:11.239+00	f	2026-05-16 22:59:11.239+00	2026-05-16 22:59:11.239+00
b2b3d44f-b072-42a4-a8ff-e7f94412e590	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcyNzk3LCJleHAiOjE3Nzk1Nzc1OTd9.gT_2huJUgAputynPiy9u9wGFNmXGRyVULjU7N_zugP0	2026-05-23 23:06:37.867+00	f	2026-05-16 23:06:37.867+00	2026-05-16 23:06:37.867+00
e0d8be0c-0cfb-4704-a315-a9837e54dbde	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcyODczLCJleHAiOjE3Nzk1Nzc2NzN9.9co6n-SP4vyaWgOf4xabBur8qN85b0YxjR1LqV_aiuA	2026-05-23 23:07:53.88+00	f	2026-05-16 23:07:53.88+00	2026-05-16 23:07:53.88+00
b00b5d67-5b24-4994-ac37-b4dcf3989079	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcyOTQ4LCJleHAiOjE3Nzk1Nzc3NDh9.q-ifeTj8cKUusYRRdchylmM3LmWzdlN9Y7j_FG7BF10	2026-05-23 23:09:08.758+00	f	2026-05-16 23:09:08.758+00	2026-05-16 23:09:08.758+00
14aa42f4-21da-47c1-83e5-c50f9f5f1cce	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTczMDAxLCJleHAiOjE3Nzk1Nzc4MDF9.4kOGVQKibirrre0pk-un504IEo4mFo-xoaRcgmOfCZw	2026-05-23 23:10:01.832+00	f	2026-05-16 23:10:01.832+00	2026-05-16 23:10:01.832+00
d6a91c72-d9fb-4249-9954-257fc8f0b36b	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTcyNDU0LCJleHAiOjE3Nzk1NzcyNTR9.hi4SvSyd4pIA5Hidngt0QAlinpfyhhv4u-6aDo7zs_w	2026-05-23 23:00:54.626+00	t	2026-05-16 23:00:54.626+00	2026-05-16 23:57:28.021+00
bff8424f-5781-41e7-b243-8d7668514936	29556c93-440f-42ef-adad-903d3e7529f2	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyOTU1NmM5My00NDBmLTQyZWYtYWRhZC05MDNkM2U3NTI5ZjIiLCJyb2xlIjoiRU1QTE9ZRUUiLCJlbXBsb3llZUlkIjoiNTczYjhmZGYtMzYwZC00MjUzLTllNWMtMGU4NWU1MmE2Y2VkIiwiaWF0IjoxNzc4OTc1ODY0LCJleHAiOjE3Nzk1ODA2NjR9.a6tr4ti4szEkjx9PPb3JMKVk5W2IU_4nN4CxPbqbUks	2026-05-23 23:57:44.921+00	t	2026-05-16 23:57:44.922+00	2026-05-16 23:58:37.031+00
505111be-36b4-48f2-b59a-f29adc8fadaa	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTg1NzE1LCJleHAiOjE3Nzk1OTA1MTV9.5pEtDUNpNIgqabfsMoL6wrfS18ETTxWSLu92meDD52M	2026-05-24 02:41:55.336+00	f	2026-05-17 02:41:55.337+00	2026-05-17 02:41:55.337+00
40e5cdd0-3e24-4e75-a6ac-54be68bc1d46	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTkwODMyLCJleHAiOjE3Nzk1OTU2MzJ9.gt61TphlmNSQGw9bhKphnpOj75F-WIsg4IgtnPE-5nA	2026-05-24 04:07:12.048+00	f	2026-05-17 04:07:12.048+00	2026-05-17 04:07:12.048+00
3a89235c-cfa8-4c4b-aaef-e191962c2c50	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MDAyMzIwLCJleHAiOjE3Nzk2MDcxMjB9.96uEGp85q5CkdVzpUW0iQuDSAmkIZHGbgqZBsFFoqw8	2026-05-24 07:18:40.772+00	f	2026-05-17 07:18:40.773+00	2026-05-17 07:18:40.773+00
54663f07-ce48-4cfc-a05d-e61509654b5f	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc4OTc1OTE5LCJleHAiOjE3Nzk1ODA3MTl9.L0w9TKCkPvkNW7kzqYILTbhFbkVWaFoLRECFtzjRaJk	2026-05-23 23:58:39.816+00	t	2026-05-16 23:58:39.816+00	2026-05-17 10:05:10.46+00
d9f543a3-2f04-4027-9658-9d4047c9954f	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MDEyMzEzLCJleHAiOjE3Nzk2MTcxMTN9.JIiQJxEtlZNFB0FCIjeileJXl-hs6EJbWCyN_xIpcrY	2026-05-24 10:05:13.383+00	f	2026-05-17 10:05:13.384+00	2026-05-17 10:05:13.384+00
ae77b033-6e66-456f-aa54-5b604eccb6f5	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MDE3NTA2LCJleHAiOjE3Nzk2MjIzMDZ9.0Uc-_5zG4I2uPS756FjqEu9wRdwpMVBCTkUHKIXJSjw	2026-05-24 11:31:46.666+00	f	2026-05-17 11:31:46.667+00	2026-05-17 11:31:46.667+00
263faddf-af0a-4aee-aac9-1367565193f6	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MDE3NzMwLCJleHAiOjE3Nzk2MjI1MzB9.nC6M-enal9T1rNRmaDpuJ8-0Rd0WTUfdB-OdsbUuPxs	2026-05-24 11:35:30.193+00	f	2026-05-17 11:35:30.193+00	2026-05-17 11:35:30.193+00
7fbac49f-a482-455f-a0c2-190ea242ec58	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MDI3MDU3LCJleHAiOjE3Nzk2MzE4NTd9.A42TmocfsRJUgWUBo_j_v53kGrjCeZovKNB-FxXzhFU	2026-05-24 14:10:57.983+00	f	2026-05-17 14:10:57.984+00	2026-05-17 14:10:57.984+00
9a7b5fe4-d429-4672-a888-cb492a3c7427	a6715dcf-0eee-49c5-b66d-00261bc30a57	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhNjcxNWRjZi0wZWVlLTQ5YzUtYjY2ZC0wMDI2MWJjMzBhNTciLCJyb2xlIjoiRU1QTE9ZRUUiLCJlbXBsb3llZUlkIjoiMGFjMmM0NDUtZmQwNS00ZTI2LTlkYjUtZGVkYTc4NWYwMzBiIiwiaWF0IjoxNzc5MDI3MjUyLCJleHAiOjE3Nzk2MzIwNTJ9.ds0C4bcpPgctjt6p5-mRLcWnFPox3j9kezpNkT6R3CY	2026-05-24 14:14:12.06+00	f	2026-05-17 14:14:12.06+00	2026-05-17 14:14:12.06+00
054640dc-f473-4617-b2fd-0c4c08c9af7b	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MDMwNDY1LCJleHAiOjE3Nzk2MzUyNjV9.qJSeCf8T9AKSEYBqnM0fn7qxbA5kdyGCtbw0bsNkar4	2026-05-24 15:07:45.73+00	f	2026-05-17 15:07:45.73+00	2026-05-17 15:07:45.73+00
8008a06d-f8bd-40e0-b8b3-f4c64fc908d1	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MDMxOTcwLCJleHAiOjE3Nzk2MzY3NzB9.YNDJYmhaL7TimJSYhmBTfM5HsATKI9ddg-JO2D0aqKQ	2026-05-24 15:32:50.428+00	f	2026-05-17 15:32:50.428+00	2026-05-17 15:32:50.428+00
c13f7a17-c857-46cb-8f07-efb7f1c2126b	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MTM0MjMyLCJleHAiOjE3Nzk3MzkwMzJ9.bbKsuLt2EdRjAigE6Cfb1_8q1DPgR-BqSEoq5SrrJlU	2026-05-25 19:57:12.176+00	f	2026-05-18 19:57:12.177+00	2026-05-18 19:57:12.177+00
a989406f-2eff-44c4-ab4e-ea9e056420b3	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MTM0NDEwLCJleHAiOjE3Nzk3MzkyMTB9.Xqg8fVFB7uXaFF8fbWhte4hjtYldlwqR-rpv16LGGZU	2026-05-25 20:00:10.018+00	f	2026-05-18 20:00:10.019+00	2026-05-18 20:00:10.019+00
0ffae690-904c-4023-8058-a0fc17af885d	82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4MmZiZTFkNS1lNmJiLTRkZmUtYjEwMi1jZTZmNzhhMDQxZjMiLCJyb2xlIjoiQURNSU4iLCJlbXBsb3llZUlkIjoiYTYxYTZiYzYtZGU0Ny00ZjQ3LTgxNDYtNzk3OTczM2Y3MDg4IiwiaWF0IjoxNzc5MTM0MjU1LCJleHAiOjE3Nzk3MzkwNTV9.FACST30Z7m4811X6FNH3icolAr4ff6ldboNvUt-m7Xw	2026-05-25 19:57:35.337+00	t	2026-05-18 19:57:35.338+00	2026-05-18 20:00:49.796+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role, employee_id, is_active, failed_login_attempts, locked_until, created_at, updated_at) FROM stdin;
476bd6be-4e6a-44cd-9623-0f6db5ba530b	hr@erp.local	$2a$10$gtVQ/DSv8Z/fLr1y1fqQJ.pke6589.H0hNF9WYnRitc8LrnokQMMu	HR_MANAGER	36f918f1-8267-4ed3-bda3-aba7ccc86ea4	t	0	\N	2026-05-16 22:17:20.64+00	2026-05-16 22:17:20.64+00
29556c93-440f-42ef-adad-903d3e7529f2	employee@erp.local	$2a$10$EI0kuT0hfX4iOB6DEg9N..i1Y5JZYAfCB/VoxTqykKXgFqNzwyAHW	EMPLOYEE	573b8fdf-360d-4253-9e5c-0e85e52a6ced	t	0	\N	2026-05-16 22:17:20.645+00	2026-05-16 22:17:20.645+00
a6715dcf-0eee-49c5-b66d-00261bc30a57	ahmet.ates@erp.local	$2a$10$dFOHV5RbzEcv7SzCAF8V.O7YGPsi2tneBxhEFyClSDpKLMKLBd4HO	EMPLOYEE	0ac2c445-fd05-4e26-9db5-deda785f030b	t	0	\N	2026-05-16 22:44:06.451+00	2026-05-16 22:44:06.451+00
ad51dd81-f97a-40cd-81d2-b7dc09bec430	ahmet.guler@erp.local	$2a$10$F0ZbiMqMNDatPv8sRD7.QeMq1ab2Fw4zweNvjRWmi4f.VaGMIlr2q	EMPLOYEE	a29f4ac3-7a03-47ac-8b22-6d19135bde99	t	0	\N	2026-05-16 22:52:03.015+00	2026-05-16 22:52:03.015+00
e0a77ca9-4573-40db-9d0a-a60c3110e571	veli.turk@erp.local	$2a$10$.WPjNWctnGkIRqk/VV.v0e20ehAObpN.u6Go24Q8.BNl1nEF4nBi2	EMPLOYEE	c9aa347b-2eed-4f21-9273-3682874fbe84	t	0	\N	2026-05-17 10:29:07.917+00	2026-05-17 10:29:07.917+00
82fbe1d5-e6bb-4dfe-b102-ce6f78a041f3	admin@erp.local	$2a$10$D1Lc.hR4FeViCM2U57cpEepklOYYaI7V3PfL.v5qZ/L5Hxp6AhimG	ADMIN	a61a6bc6-de47-4f47-8146-7979733f7088	t	0	\N	2026-05-16 22:17:20.632+00	2026-05-17 14:10:57.976+00
\.


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: criterion_scores criterion_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.criterion_scores
    ADD CONSTRAINT criterion_scores_pkey PRIMARY KEY (id);


--
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- Name: departments departments_code_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key1 UNIQUE (code);


--
-- Name: departments departments_code_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key10 UNIQUE (code);


--
-- Name: departments departments_code_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key11 UNIQUE (code);


--
-- Name: departments departments_code_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key12 UNIQUE (code);


--
-- Name: departments departments_code_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key13 UNIQUE (code);


--
-- Name: departments departments_code_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key14 UNIQUE (code);


--
-- Name: departments departments_code_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key15 UNIQUE (code);


--
-- Name: departments departments_code_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key16 UNIQUE (code);


--
-- Name: departments departments_code_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key17 UNIQUE (code);


--
-- Name: departments departments_code_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key18 UNIQUE (code);


--
-- Name: departments departments_code_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key19 UNIQUE (code);


--
-- Name: departments departments_code_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key2 UNIQUE (code);


--
-- Name: departments departments_code_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key20 UNIQUE (code);


--
-- Name: departments departments_code_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key21 UNIQUE (code);


--
-- Name: departments departments_code_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key22 UNIQUE (code);


--
-- Name: departments departments_code_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key23 UNIQUE (code);


--
-- Name: departments departments_code_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key24 UNIQUE (code);


--
-- Name: departments departments_code_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key25 UNIQUE (code);


--
-- Name: departments departments_code_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key26 UNIQUE (code);


--
-- Name: departments departments_code_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key27 UNIQUE (code);


--
-- Name: departments departments_code_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key28 UNIQUE (code);


--
-- Name: departments departments_code_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key29 UNIQUE (code);


--
-- Name: departments departments_code_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key3 UNIQUE (code);


--
-- Name: departments departments_code_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key4 UNIQUE (code);


--
-- Name: departments departments_code_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key5 UNIQUE (code);


--
-- Name: departments departments_code_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key6 UNIQUE (code);


--
-- Name: departments departments_code_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key7 UNIQUE (code);


--
-- Name: departments departments_code_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key8 UNIQUE (code);


--
-- Name: departments departments_code_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key9 UNIQUE (code);


--
-- Name: departments departments_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key UNIQUE (name);


--
-- Name: departments departments_name_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key1 UNIQUE (name);


--
-- Name: departments departments_name_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key10 UNIQUE (name);


--
-- Name: departments departments_name_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key11 UNIQUE (name);


--
-- Name: departments departments_name_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key12 UNIQUE (name);


--
-- Name: departments departments_name_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key13 UNIQUE (name);


--
-- Name: departments departments_name_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key14 UNIQUE (name);


--
-- Name: departments departments_name_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key15 UNIQUE (name);


--
-- Name: departments departments_name_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key16 UNIQUE (name);


--
-- Name: departments departments_name_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key17 UNIQUE (name);


--
-- Name: departments departments_name_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key18 UNIQUE (name);


--
-- Name: departments departments_name_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key19 UNIQUE (name);


--
-- Name: departments departments_name_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key2 UNIQUE (name);


--
-- Name: departments departments_name_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key20 UNIQUE (name);


--
-- Name: departments departments_name_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key21 UNIQUE (name);


--
-- Name: departments departments_name_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key22 UNIQUE (name);


--
-- Name: departments departments_name_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key23 UNIQUE (name);


--
-- Name: departments departments_name_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key24 UNIQUE (name);


--
-- Name: departments departments_name_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key25 UNIQUE (name);


--
-- Name: departments departments_name_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key26 UNIQUE (name);


--
-- Name: departments departments_name_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key27 UNIQUE (name);


--
-- Name: departments departments_name_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key28 UNIQUE (name);


--
-- Name: departments departments_name_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key29 UNIQUE (name);


--
-- Name: departments departments_name_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key3 UNIQUE (name);


--
-- Name: departments departments_name_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key30 UNIQUE (name);


--
-- Name: departments departments_name_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key4 UNIQUE (name);


--
-- Name: departments departments_name_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key5 UNIQUE (name);


--
-- Name: departments departments_name_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key6 UNIQUE (name);


--
-- Name: departments departments_name_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key7 UNIQUE (name);


--
-- Name: departments departments_name_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key8 UNIQUE (name);


--
-- Name: departments departments_name_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_name_key9 UNIQUE (name);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: employee_documents employee_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents
    ADD CONSTRAINT employee_documents_pkey PRIMARY KEY (id);


--
-- Name: employee_history employee_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_history
    ADD CONSTRAINT employee_history_pkey PRIMARY KEY (id);


--
-- Name: employees employees_employee_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key1 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key10 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key11 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key12 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key13 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key14 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key15 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key16 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key17 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key18 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key19 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key2 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key20 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key21 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key22 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key23 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key24 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key25 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key26 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key27 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key28 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key29 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key3 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key4 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key5 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key6 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key7 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key8 UNIQUE (employee_no);


--
-- Name: employees employees_employee_no_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_employee_no_key9 UNIQUE (employee_no);


--
-- Name: employees employees_national_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key UNIQUE (national_id);


--
-- Name: employees employees_national_id_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key1 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key10 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key11 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key12 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key13 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key14 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key15 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key16 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key17 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key18 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key19 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key2 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key20 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key21 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key22 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key23 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key24 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key25 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key26 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key27 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key28 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key29 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key3 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key30 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key4 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key5 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key6 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key7 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key8 UNIQUE (national_id);


--
-- Name: employees employees_national_id_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_national_id_key9 UNIQUE (national_id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: evaluation_periods evaluation_periods_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluation_periods
    ADD CONSTRAINT evaluation_periods_pkey PRIMARY KEY (id);


--
-- Name: evaluations evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_pkey PRIMARY KEY (id);


--
-- Name: goals goals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_pkey PRIMARY KEY (id);


--
-- Name: leave_balances leave_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_pkey PRIMARY KEY (id);


--
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- Name: leaves leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: payroll_items payroll_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_items
    ADD CONSTRAINT payroll_items_pkey PRIMARY KEY (id);


--
-- Name: payroll_parameters payroll_parameters_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_parameters
    ADD CONSTRAINT payroll_parameters_pkey PRIMARY KEY (id);


--
-- Name: payrolls payrolls_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_pkey PRIMARY KEY (id);


--
-- Name: performance_criteria performance_criteria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.performance_criteria
    ADD CONSTRAINT performance_criteria_pkey PRIMARY KEY (id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (id);


--
-- Name: positions positions_position_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key UNIQUE (position_code);


--
-- Name: positions positions_position_code_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key1 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key10 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key11 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key12 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key13 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key14 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key15 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key16 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key17 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key18 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key19 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key2 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key3 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key4 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key5 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key6 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key7 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key8 UNIQUE (position_code);


--
-- Name: positions positions_position_code_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_code_key9 UNIQUE (position_code);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_announcements_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_announcements_active ON public.announcements USING btree (is_active, published_at);


--
-- Name: idx_audit_logs_entity; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_entity ON public.audit_logs USING btree (entity_type);


--
-- Name: idx_audit_logs_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_user ON public.audit_logs USING btree (user_id);


--
-- Name: idx_emp_docs_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_emp_docs_employee ON public.employee_documents USING btree (employee_id);


--
-- Name: idx_emp_history_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_emp_history_employee ON public.employee_history USING btree (employee_id);


--
-- Name: idx_emp_history_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_emp_history_type ON public.employee_history USING btree (change_type);


--
-- Name: idx_employees_department; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_department ON public.employees USING btree (department_id);


--
-- Name: idx_employees_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_status ON public.employees USING btree (status);


--
-- Name: idx_leaves_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leaves_employee ON public.leaves USING btree (employee_id);


--
-- Name: idx_leaves_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leaves_status ON public.leaves USING btree (status);


--
-- Name: idx_notifications_read; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_read ON public.notifications USING btree (user_id, is_read);


--
-- Name: idx_notifications_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id);


--
-- Name: idx_payrolls_employee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payrolls_employee ON public.payrolls USING btree (employee_id);


--
-- Name: idx_payrolls_period; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payrolls_period ON public.payrolls USING btree (period_year, period_month);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: criterion_scores criterion_scores_criterion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.criterion_scores
    ADD CONSTRAINT criterion_scores_criterion_id_fkey FOREIGN KEY (criterion_id) REFERENCES public.performance_criteria(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: criterion_scores criterion_scores_evaluation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.criterion_scores
    ADD CONSTRAINT criterion_scores_evaluation_id_fkey FOREIGN KEY (evaluation_id) REFERENCES public.evaluations(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: departments departments_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employee_documents employee_documents_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_documents
    ADD CONSTRAINT employee_documents_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employee_history employee_history_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_history
    ADD CONSTRAINT employee_history_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employees employees_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employees employees_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: employees employees_position_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_position_id_fkey FOREIGN KEY (position_id) REFERENCES public.positions(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: evaluations evaluations_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: evaluations evaluations_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.evaluation_periods(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: goals goals_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: goals goals_period_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goals
    ADD CONSTRAINT goals_period_id_fkey FOREIGN KEY (period_id) REFERENCES public.evaluation_periods(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_balances leave_balances_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_balances leave_balances_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leaves leaves_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leaves leaves_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leaves
    ADD CONSTRAINT leaves_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payroll_items payroll_items_payroll_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payroll_items
    ADD CONSTRAINT payroll_items_payroll_id_fkey FOREIGN KEY (payroll_id) REFERENCES public.payrolls(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: payrolls payrolls_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payrolls
    ADD CONSTRAINT payrolls_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: positions positions_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: users users_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict 3JDmbeCkzmhw4QAiV7LWHf3oHfEsLvDcWFgSap6EZ5PUsGn0MJ3oQg15pLEN6Vs

