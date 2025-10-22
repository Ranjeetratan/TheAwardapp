-- Insert investor profiles into the database
INSERT INTO profiles (
  full_name, 
  email, 
  headshot_url, 
  location, 
  linkedin_profile, 
  website_portfolio, 
  short_bio, 
  availability, 
  looking_for, 
  role, 
  investment_range, 
  investment_stage, 
  investment_focus, 
  portfolio_companies, 
  investment_criteria, 
  approved, 
  featured, 
  created_at
) VALUES 
('83North (Greylock IL)', 'contact@83north.com', 'https://media.licdn.com/dms/image/v2/C4E0BAQHM4yn93Q6-Uw/company-logo_200_200/company-logo_200_200/0/1630566660145/83north_logo?e=1762992000&v=beta&t=YLrYKP4srsC28FOsDCBYbJlIYHwgGePBUvmEsScWP0Y', 'Israel/UK', 'https://linkedin.com/company/83north', NULL, 'Leading venture capital firm with flagship investments in IronSource and Mirakl. Focus on growth-stage technology companies.', 'Full-time', 'Growth-stage startups', 'investor', 'US$2M–15M', 'Series A', 'Technology, SaaS', 'IronSource, Mirakl', 'Strong team, proven traction, scalable business model', true, true, NOW()),

('A16Z Speedrun', 'speedrun@a16z.com', 'https://media.licdn.com/dms/image/v2/D560BAQFs3wvS2NM10g/company-logo_200_200/B56ZaiHxu.GoAU-/0/1746476670161/a16z_logo?e=1762992000&v=beta&t=Ive3g1DDYGHv7N7UAZuy6uTJmMGzitc5_rLdHeoPjaM', 'USA', 'https://linkedin.com/company/andreessen-horowitz', NULL, 'Andreessen Horowitz speedrun program for early-stage startups. Portfolio includes k‑ID and Hedra.', 'Full-time', 'Early-stage startups', 'investor', 'US$0.75M–1M', 'Pre-Seed', 'AI, Consumer Tech', 'k‑ID, Hedra', 'Innovative technology, strong founding team, clear market opportunity', true, true, NOW()),

('NTX', 'contact@ntx.com', 'https://media.licdn.com/dms/image/v2/D4E0BAQGXMcX-xiIrGQ/company-logo_200_200/company-logo_200_200/0/1737994150598/ntx_it_logo?e=1762992000&v=beta&t=6MSR6iQDItarzwzGPqGekVOUEMTk9_8SD26kge7KUFs', 'USA', 'https://linkedin.com/company/accel', NULL, 'Technology-focused venture capital with successful investments in Slack and Atlassian.', 'Full-time', 'Enterprise software startups', 'investor', 'US$5M–50M', 'Series A', 'Enterprise Software, SaaS', 'Slack, Atlassian', 'Enterprise-ready solutions, strong product-market fit, experienced team', true, false, NOW()),

('AI Fund', 'contact@aifund.ai', 'https://media.licdn.com/dms/image/v2/C4D0BAQFf9dbpZcfsRQ/company-logo_200_200/company-logo_200_200/0/1631781397052/ai_fund_logo?e=1762992000&v=beta&t=rIf9EjbtS9n9V8NuB9hGvLFMRXtEZ4sLaNm1ZmCSEck', 'USA', 'https://linkedin.com/company/ai-fund', NULL, 'Specialized AI-focused venture fund with investments in Gaia Dynamics and SkyFire AI.', 'Full-time', 'AI/ML startups', 'investor', 'US$0.25M–1M', 'Pre-Seed', 'Artificial Intelligence, Machine Learning', 'Gaia Dynamics, SkyFire AI', 'AI-first approach, technical excellence, scalable AI solutions', true, false, NOW()),

('Andreessen Horowitz', 'contact@a16z.com', 'https://media.licdn.com/dms/image/v2/D560BAQFs3wvS2NM10g/company-logo_200_200/B56ZaiHxu.GoAU-/0/1746476670161/a16z_logo?e=1762992000&v=beta&t=Ive3g1DDYGHv7N7UAZuy6uTJmMGzitc5_rLdHeoPjaM', 'USA', 'https://linkedin.com/company/andreessen-horowitz', NULL, 'Premier Silicon Valley VC firm with legendary investments in GitHub and Airbnb. Leading technology investor.', 'Full-time', 'Technology startups', 'investor', 'US$1M–100M', 'All Stages', 'Technology, Software, Crypto', 'GitHub, Airbnb', 'Exceptional founders, large market opportunity, disruptive technology', true, true, NOW()),

('Bain Capital Ventures', 'contact@baincapitalventures.com', 'https://media.licdn.com/dms/image/v2/D4E0BAQGqwwDEGws1Yg/company-logo_200_200/company-logo_200_200/0/1715700510572/bain_capital_ventures_logo?e=1762992000&v=beta&t=urCsFYtQljguK7fPpF8R_2YNJOVJ2iQaIMS_yzhGiWk', 'USA', 'https://linkedin.com/company/bain-capital-ventures', NULL, 'Growth equity and venture capital with successful investments in Attentive and SendGrid.', 'Full-time', 'Growth-stage companies', 'investor', 'US$2M–20M', 'Series A', 'SaaS, E-commerce', 'Attentive, SendGrid', 'Proven business model, strong growth metrics, market leadership potential', true, false, NOW()),

('Battery Ventures', 'contact@battery.com', 'https://media.licdn.com/dms/image/v2/D560BAQErSim69xLiJw/company-logo_200_200/company-logo_200_200/0/1709240788593/battery_ventures_logo?e=1762992000&v=beta&t=hgQLDFzrX2JRvd2P7JeuPhDiUcy65IBJBGrT7jVRMRs', 'USA', 'https://linkedin.com/company/battery-ventures', NULL, 'Technology-focused VC with portfolio companies Braze and Coupa. Specializes in software and infrastructure.', 'Full-time', 'Software startups', 'investor', 'US$5M–30M', 'Series A', 'Software, Infrastructure', 'Braze, Coupa', 'Software innovation, recurring revenue model, scalable technology', true, false, NOW()),

('Benchmark', 'contact@benchmark.com', 'https://media.licdn.com/dms/image/v2/D4D0BAQE9JhI9MSqmTQ/company-logo_200_200/B4DZVKXkWEHwAI-/0/1740709447565/benchmark_capital_logo?e=1762992000&v=beta&t=r1mX3FZmrVg4zDRQtqM9yfr_EwolQ4uG_OtOLfmWmVU', 'USA', 'https://linkedin.com/company/benchmark-capital', NULL, 'Iconic Silicon Valley VC firm with legendary investments in Uber and Twitter. Known for backing transformative companies.', 'Full-time', 'Disruptive startups', 'investor', 'US$5M–40M', 'Series A', 'Consumer, Enterprise', 'Uber, Twitter', 'Exceptional founders, massive market opportunity, potential for category creation', true, true, NOW()),

('Bessemer Venture Partners', 'contact@bvp.com', 'https://media.licdn.com/dms/image/v2/D560BAQF2-_rRIldZpw/company-logo_200_200/company-logo_200_200/0/1719862419823/bessemer_venture_partners_logo?e=1762992000&v=beta&t=OR8UhHSiAJQZnkQ9irfZeOfV8ZOLxOt3bdd2qf8lYeY', 'USA', 'https://linkedin.com/company/bessemer-venture-partners', NULL, 'Historic VC firm with successful investments in LinkedIn and Twilio. Focus on cloud and software companies.', 'Full-time', 'Cloud software startups', 'investor', 'US$1M–50M', 'All Stages', 'Cloud, SaaS, Infrastructure', 'LinkedIn, Twilio', 'Cloud-first approach, strong unit economics, experienced management team', true, false, NOW()),

('Y Combinator', 'contact@ycombinator.com', 'https://media.licdn.com/dms/image/v2/C4D0BAQGPzdBPNxrmEg/company-logo_200_200/company-logo_200_200/0/1673555093250/y_combinator_logo?e=1762992000&v=beta&t=5hHJwShvaLj3qZj_jWWatMYC5zC5WC6jvp-GEBsZFxw', 'USA', 'https://linkedin.com/company/y-combinator', NULL, 'World''s most successful startup accelerator with alumni including Dropbox and Airbnb. The gold standard for early-stage funding.', 'Full-time', 'Early-stage startups', 'investor', 'US$0.125M–0.5M', 'Pre-Seed', 'All sectors', 'Dropbox, Airbnb', 'Strong founding team, clear vision, ability to execute quickly', true, true, NOW());