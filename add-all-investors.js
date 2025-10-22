import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wwkoqrqzxlhqvbvpiwpr.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3a29xcnF6eGxocXZidnBpd3ByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MjE1MjAsImV4cCI6MjA3NjE5NzUyMH0.bqxKTAU62M2KD0gec9HC_kJfJMZN_BZpn2PAbDLwbKg'

const supabase = createClient(supabaseUrl, supabaseKey)

const investors = [
{"Name": "83North (Greylock IL)","Linkedin": "linkedin.com/company/83north","Country": "Israel/UK","Flagship": "IronSource, Mirakl","Range": "US$2M–15M","Logo": "https://media.licdn.com/dms/image/v2/C4E0BAQHM4yn93Q6-Uw/company-logo_200_200/company-logo_200_200/0/1630566660145/83north_logo?e=1762992000&v=beta&t=YLrYKP4srsC28FOsDCBYbJlIYHwgGePBUvmEsScWP0Y"},
{"Name": "A16Z Speedrun","Linkedin": "linkedin.com/company/andreessen-horowitz","Country": "USA","Flagship": "k‑ID, Hedra","Range": "US$0.75M–1M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQFs3wvS2NM10g/company-logo_200_200/B56ZaiHxu.GoAU-/0/1746476670161/a16z_logo?e=1762992000&v=beta&t=Ive3g1DDYGHv7N7UAZuy6uTJmMGzitc5_rLdHeoPjaM"},
{"Name": "NTX","Linkedin": "linkedin.com/company/accel","Country": "USA","Flagship": "Slack, Atlassian","Range": "US$5M–50M","Logo": "https://media.licdn.com/dms/image/v2/D4E0BAQGXMcX-xiIrGQ/company-logo_200_200/company-logo_200_200/0/1737994150598/ntx_it_logo?e=1762992000&v=beta&t=6MSR6iQDItarzwzGPqGekVOUEMTk9_8SD26kge7KUFs"},
{"Name": "AI Fund","Linkedin": "linkedin.com/company/ai-fund","Country": "USA","Flagship": "Gaia Dynamics, SkyFire AI","Range": "US$0.25M–1M","Logo": "https://media.licdn.com/dms/image/v2/C4D0BAQFf9dbpZcfsRQ/company-logo_200_200/company-logo_200_200/0/1631781397052/ai_fund_logo?e=1762992000&v=beta&t=rIf9EjbtS9n9V8NuB9hGvLFMRXtEZ4sLaNm1ZmCSEck"},
{"Name": "Andreessen Horowitz","Linkedin": "linkedin.com/company/andreessen-horowitz","Country": "USA","Flagship": "GitHub, Airbnb","Range": "US$1M–100M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQFs3wvS2NM10g/company-logo_200_200/B56ZaiHxu.GoAU-/0/1746476670161/a16z_logo?e=1762992000&v=beta&t=Ive3g1DDYGHv7N7UAZuy6uTJmMGzitc5_rLdHeoPjaM"},
{"Name": "Bain Capital Ventures","Linkedin": "linkedin.com/company/bain-capital-ventures","Country": "USA","Flagship": "Attentive, SendGrid","Range": "US$2M–20M","Logo": "https://media.licdn.com/dms/image/v2/D4E0BAQGqwwDEGws1Yg/company-logo_200_200/company-logo_200_200/0/1715700510572/bain_capital_ventures_logo?e=1762992000&v=beta&t=urCsFYtQljguK7fPpF8R_2YNJOVJ2iQaIMS_yzhGiWk"},
{"Name": "Battery Ventures","Linkedin": "linkedin.com/company/battery-ventures","Country": "USA","Flagship": "Braze, Coupa","Range": "US$5M–30M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQErSim69xLiJw/company-logo_200_200/company-logo_200_200/0/1709240788593/battery_ventures_logo?e=1762992000&v=beta&t=hgQLDFzrX2JRvd2P7JeuPhDiUcy65IBJBGrT7jVRMRs"},
{"Name": "Benchmark","Linkedin": "linkedin.com/company/benchmark-capital","Country": "USA","Flagship": "Uber, Twitter","Range": "US$5M–40M","Logo": "https://media.licdn.com/dms/image/v2/D4D0BAQE9JhI9MSqmTQ/company-logo_200_200/B4DZVKXkWEHwAI-/0/1740709447565/benchmark_capital_logo?e=1762992000&v=beta&t=r1mX3FZmrVg4zDRQtqM9yfr_EwolQ4uG_OtOLfmWmVU"},
{"Name": "Bessemer Venture Partners","Linkedin": "linkedin.com/company/bessemer-venture-partners","Country": "USA","Flagship": "LinkedIn, Twilio","Range": "US$1M–50M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQF2-_rRIldZpw/company-logo_200_200/company-logo_200_200/0/1719862419823/bessemer_venture_partners_logo?e=1762992000&v=beta&t=OR8UhHSiAJQZnkQ9irfZeOfV8ZOLxOt3bdd2qf8lYeY"},
{"Name": "Bossa Invest","Linkedin": "linkedin.com/company/bossa-invest","Country": "Brazil","Flagship": "Local SaaS holdings","Range": "US$0.05M–0.5M","Logo": "https://media.licdn.com/dms/image/v2/D4D0BAQHeaNFnpAIjAg/company-logo_200_200/company-logo_200_200/0/1693485385968/bossanova_investimentos_logo?e=1762992000&v=beta&t=VRZ8bI-vJiS7FXEpPvXMDVwFPg-bgmMY-HpM3qBiVL0"},
{"Name": "BoxGroup","Linkedin": "linkedin.com/company/boxgroup","Country": "USA","Flagship": "Warby Parker, Harry's","Range": "US$0.1M–0.5M","Logo": "https://media.licdn.com/dms/image/v2/C4D0BAQEUQ4Qm8PWJxQ/company-logo_200_200/company-logo_200_200/0/1631322008904?e=1762992000&v=beta&t=zB8kHq_Skn_IdEzQMAmQVKTjN71SiHXqaamXkB1Rsi8"},
{"Name": "Bpifrance","Linkedin": "linkedin.com/company/bpifrance","Country": "France","Flagship": "Doctolib, Vestiaire Collective","Range": "US$0.5M–10M","Logo": "https://media.licdn.com/dms/image/v2/C4D0BAQE_pjlLkNPv7Q/company-logo_200_200/company-logo_200_200/0/1630464491015/bpifrance_logo?e=1762992000&v=beta&t=-rf8rdAb-B425ZuXk--MQzdHXJ8wEi9YlVC4ngf8d8o"},
{"Name": "Canaan Partners","Linkedin": "linkedin.com/company/canaan-partners","Country": "USA","Flagship": "LendingClub, Instacart","Range": "US$3M–15M","Logo": "https://media.licdn.com/dms/image/v2/C560BAQE4kNyopCIviw/company-logo_200_200/company-logo_200_200/0/1631320489850?e=1762992000&v=beta&t=YOv1ggp80H50rSknpSD_aynZcqLfmq6w2uvZ2HGcQuY"},
{"Name": "Cherubic Ventures","Linkedin": "linkedin.com/company/cherubic-ventures","Country": "USA/Taiwan","Flagship": "Calm, Flexport","Range": "US$0.5M–3M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQEWTDU3BZooCA/company-logo_200_200/B56Znbe5jXKMAI-/0/1760323934776/cherubic_ventures_logo?e=1762992000&v=beta&t=4kS5Kx1OdSnW4OLS6bY-uSXn5CZ1xoJrQvNinqttcTQ"},
{"Name": "Coatue Management","Linkedin": "linkedin.com/company/coatue-management","Country": "USA","Flagship": "Databricks, OpenAI","Range": "US$10M–100M","Logo": "https://media.licdn.com/dms/image/v2/D4E0BAQEGLDfos3ZzOA/company-logo_200_200/company-logo_200_200/0/1665674233050/coatue_management_logo?e=1762992000&v=beta&t=4iExjC3lqnFlqfV23F1FvsOiV4-eQqsy5cy9PBTUDb4"},
{"Name": "Craft Ventures","Linkedin": "linkedin.com/company/craft-ventures","Country": "USA","Flagship": "Notion, Mercury","Range": "US$1M–10M","Logo": "https://media.licdn.com/dms/image/v2/C4D0BAQFqF7XsObo0aA/company-logo_200_200/company-logo_200_200/0/1631300338011?e=1762992000&v=beta&t=jIc0yBUoq69Ab3rb_1y7jEbrVkR-TRPnd0AFNL-5B98"},
{"Name": "CRV (Charles River Ventures)","Linkedin": "linkedin.com/company/crv","Country": "USA","Flagship": "Zendesk, HubSpot","Range": "US$2M–20M","Logo": "https://media.licdn.com/dms/image/v2/D4E0BAQE4tVn4O8cqGA/company-logo_200_200/company-logo_200_200/0/1737551681139/crv_logo?e=1762992000&v=beta&t=aNygJdZEunbHa2eVHHK-rUGJo14PCmvDCZ-Ln_ODJ7M"},
{"Name": "Crosslink Capital","Linkedin": "linkedin.com/company/crosslink-capital","Country": "USA","Flagship": "Chime, Weave","Range": "US$1M–5M","Logo": "https://media.licdn.com/dms/image/v2/C560BAQHQUHpONLNXvQ/company-logo_200_200/company-logo_200_200/0/1630614538819/crosslink_capital_logo?e=1762992000&v=beta&t=JOc8A1Y-mV0Vw9DAVtvueNRkCIgS6i4i2mYnDb8BG-A"},
{"Name": "DCVC (Data Collective)","Linkedin": "linkedin.com/company/dcvc","Country": "USA","Flagship": "Planet Labs, Rocket Lab","Range": "US$2M–10M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQGhczoQCTNECQ/company-logo_200_200/company-logo_200_200/0/1689000565965/dcvc_logo?e=1762992000&v=beta&t=oIWT8ghXrfbHXRvJ4tjiSoChzJg_U3cYUfGAMvlR6Tk"},
{"Name": "Enterprise Ireland","Linkedin": "linkedin.com/company/enterprise-ireland","Country": "Ireland","Flagship": "Intercom, Flipdish","Range": "US$0.1M–5M","Logo": "https://media.licdn.com/dms/image/v2/D4E0BAQFhegEJ0UTScw/company-logo_200_200/company-logo_200_200/0/1681811266983/enterprise_ireland_logo?e=1762992000&v=beta&t=PAvb_lDnP6N1THFIpj7yloiaIy4QTPSBWTAh1MBJJUE"},
{"Name": "Felicis Ventures","Linkedin": "linkedin.com/company/felicis-ventures","Country": "USA","Flagship": "Canva, Notion","Range": "US$1M–10M","Logo": "https://media.licdn.com/dms/image/v2/C4E0BAQEf7XaTsMGs9A/company-logo_200_200/company-logo_200_200/0/1677713495003/felicis_ventures_logo?e=1762992000&v=beta&t=ndcCZwImDvZ4fFPvzx8avKwwX2V-fVfAGEu8pN9Crsk"},
{"Name": "First Round Capital","Linkedin": "linkedin.com/company/first-round-capital","Country": "USA","Flagship": "Uber, Notion","Range": "US$0.5M–5M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQGzdnk04NxhLA/company-logo_200_200/B56ZWq4d.FHQAI-/0/1742328684688/first_round_capital_logo?e=1762992000&v=beta&t=ZOWJ4pptQDDWtfJ9XaYu_rAclcQtDWjkYV6LK9hcXQo"},
{"Name": "FJ Labs","Linkedin": "linkedin.com/company/fj-labs","Country": "USA","Flagship": "Alibaba, Uber","Range": "US$0.2M–0.5M","Logo": "https://media.licdn.com/dms/image/v2/C4D0BAQE9eaYSdQXpGg/company-logo_200_200/company-logo_200_200/0/1631350558841?e=1762992000&v=beta&t=YK5RLPtm6GI4FFNCCwrHmtPX05RfnqKZ6AAOQ5Tvdmw"},
{"Name": "Founder Collective","Linkedin": "linkedin.com/company/founder-collective","Country": "USA","Flagship": "PillPack, The Trade Desk","Range": "US$1M–3M","Logo": "https://media.licdn.com/dms/image/v2/C4E0BAQE9mTTnueG-BQ/company-logo_200_200/company-logo_200_200/0/1630579185471/founder_collective_logo?e=1762992000&v=beta&t=F49CuYy-XLDqtaGGyUQgMt_KeA90oX6aAFEnS7ULH4c"},
{"Name": "Forerunner Ventures","Linkedin": "linkedin.com/company/forerunner-ventures","Country": "USA","Flagship": "Warby Parker, Glossier","Range": "US$1M–5M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQHbLmE_pk5_sA/company-logo_200_200/B56ZWwXvOUGUAI-/0/1742420768858/forerunner_ventures_logo?e=1762992000&v=beta&t=jgicC5Is6ODqN--_jfC7a9csIMCCuC4AGkAO7ccdLjc"},
{"Name": "Gaingels","Linkedin": "linkedin.com/company/gaingels","Country": "USA","Flagship": "Clubhouse, Bolt","Range": "US$0.2M–2M","Logo": "https://media.licdn.com/dms/image/v2/C4D0BAQFYCB4IYXq3qQ/company-logo_200_200/company-logo_200_200/0/1630521535094/gaingels_logo?e=1762992000&v=beta&t=0vxmes6bVzoeZz58ikyc_ZiKxDsYQUpnRV6Yqd7G-LM"},
{"Name": "Georgian Partners","Linkedin": "linkedin.com/company/georgian","Country": "Canada","Flagship": "Shopify, WorkFusion","Range": "US$2M–10M","Logo": "https://media.licdn.com/dms/image/v2/C560BAQGfrqh9eCt9bw/company-logo_200_200/company-logo_200_200/0/1630657431036/georgian_logo?e=1762992000&v=beta&t=l9rnBg83fSuPrmRNP8BHVuJx2SYbunEtWOglMm-URrQ"},
{"Name": "GGV Capital","Linkedin": "linkedin.com/company/ggv-capital","Country": "USA","Flagship": "Slack, Airbnb","Range": "US$5M–30M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQGcEMQrGXUKBg/company-logo_200_200/company-logo_200_200/0/1711739018694/ggv_capital_logo?e=1762992000&v=beta&t=nkTsMdbvMtVvkgEjp3vy3j9G33NRzsfHHGYgdZh2mXg"},
{"Name": "Global Founders Capital","Linkedin": "linkedin.com/company/global-founders-capital","Country": "Germany","Flagship": "Canva, Revolut","Range": "US$1M–10M","Logo": "https://media.licdn.com/dms/image/v2/C4D0BAQGxsJZppAztHg/company-logo_200_200/company-logo_200_200/0/1630525414498/global_founders_capital_logo?e=1762992000&v=beta&t=E0qDHqxGGQ56WLnDWsEILqfXQXQ6gHGgqZM57Spjzkw"},
{"Name": "Goodwater Capital","Linkedin": "linkedin.com/company/goodwater-capital","Country": "USA","Flagship": "Monzo, Toss","Range": "US$2M–20M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQHApKaNHIBgAQ/company-logo_200_200/company-logo_200_200/0/1666825657124/goodwater_capital_logo?e=1762992000&v=beta&t=jBtnIdAhN3L7EzefN64yMTHVbfJpAeKhciD2WwrHUpM"},
{"Name": "GoAhead Ventures","Linkedin": "linkedin.com/company/goahead-ventures","Country": "USA","Flagship": "Early AI/ML startups","Range": "US$0.5M–1M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQETlCDwGmx3Hw/company-logo_200_200/company-logo_200_200/0/1693322538972/goahead_ventures_logo?e=1762992000&v=beta&t=TMhlvEZk3vCWDxCVPio6aEDygdaD8CLWjis33C1K6Lk"},
{"Name": "Greylock Partners","Linkedin": "linkedin.com/company/greylock-partners","Country": "USA","Flagship": "Airbnb, LinkedIn","Range": "US$5M–50M","Logo": "https://media.licdn.com/dms/image/v2/D560BAQHZfaCTQg-MEg/company-logo_200_200/company-logo_200_200/0/1696309893203/greylock_partners_logo?e=1762992000&v=beta&t=Eho7eO8Oxf8PGDtwAC8XD9h8GImutrWw5EYB3yFRwYE"},
{"Name": "Y Combinator","Linkedin": "linkedin.com/company/y-combinator","Country": "USA","Flagship": "Dropbox, Airbnb","Range": "US$0.125M–0.5M","Logo": "https://media.licdn.com/dms/image/v2/C4D0BAQGPzdBPNxrmEg/company-logo_200_200/company-logo_200_200/0/1673555093250/y_combinator_logo?e=1762992000&v=beta&t=5hHJwShvaLj3qZj_jWWatMYC5zC5WC6jvp-GEBsZFxw"}
]

// Map investment ranges to allowed values
function mapInvestmentRange(range) {
  if (range.includes('0.05M') || range.includes('0.1M') || range.includes('0.125M') || range.includes('0.2M') || range.includes('0.25M')) return '$100K-$500K'
  if (range.includes('0.5M') || range.includes('0.75M') || range.includes('1M') && !range.includes('10M')) return '$500K-$1M'
  if (range.includes('2M') || range.includes('3M') || range.includes('5M')) return '$1M-$5M'
  if (range.includes('10M') || range.includes('15M') || range.includes('20M') || range.includes('30M') || range.includes('40M') || range.includes('50M') || range.includes('100M')) return '$5M+'
  return '$1M-$5M' // default
}

function mapInvestmentStage(range) {
  if (range.includes('0.05M') || range.includes('0.1M') || range.includes('0.125M') || range.includes('0.2M') || range.includes('0.25M')) return 'Angel'
  if (range.includes('0.5M') || range.includes('0.75M') || range.includes('1M') && !range.includes('10M')) return 'Seed'
  if (range.includes('2M') || range.includes('3M') || range.includes('5M')) return 'Series A'
  return 'Series B+'
}

async function clearExistingInvestors() {
  console.log('Clearing existing investor profiles...')
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('role', 'investor')
  
  if (error) {
    console.error('Error clearing investors:', error)
  } else {
    console.log('✓ Cleared existing investors')
  }
}

async function addAllInvestors() {
  console.log('Adding all investors to database...')
  
  // Clear existing investors first
  await clearExistingInvestors()
  
  const featuredInvestors = ['Y Combinator', 'Andreessen Horowitz', '83North (Greylock IL)', 'Benchmark', 'A16Z Speedrun', 'Greylock Partners']
  
  for (const investor of investors) {
    const profile = {
      full_name: investor.Name,
      email: `contact@${investor.Name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      headshot_url: investor.Logo,
      location: investor.Country,
      linkedin_profile: `https://${investor.Linkedin}`,
      short_bio: `Leading venture capital firm with flagship investments in ${investor.Flagship}. Investment range: ${investor.Range}.`,
      availability: 'Full-time',
      looking_for: 'Promising startups',
      role: 'investor',
      investment_range: mapInvestmentRange(investor.Range),
      investment_stage: mapInvestmentStage(investor.Range),
      investment_focus: 'Technology, Software',
      portfolio_companies: investor.Flagship,
      investment_criteria: 'Strong team, proven traction, scalable business model',
      approved: true,
      featured: featuredInvestors.includes(investor.Name)
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profile])
        .select()

      if (error) {
        console.error(`Error adding ${investor.Name}:`, error)
      } else {
        console.log(`✓ Added ${investor.Name}`)
      }
    } catch (err) {
      console.error(`Failed to add ${investor.Name}:`, err)
    }
  }
  
  console.log('Finished adding all investors!')
}

addAllInvestors()