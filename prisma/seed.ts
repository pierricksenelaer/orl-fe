import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const roles = [
  { label: "Full-stack developer", value: "Full-stack developer" },
  { label: "Front-end developer", value: "Front-end developer" },
  { label: "Back-end developer", value: "Back-end developer" },
  { label: "UI Designer", value: "UI Designer" },
  { label: "Data Scientist", value: "Data Scientist" },
  { label: "Product Manager", value: "Product Manager" },
  { label: "Business Manager", value: "Business Manager" },
];

const skills = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "csharp", label: "C#" },
  { value: "typescript", label: "TypeScript" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "php", label: "PHP" },
  { value: "swift", label: "Swift" },
  { value: "kotlin", label: "Kotlin" },
  { value: "react", label: "React" },
  { value: "angular", label: "Angular" },
  { value: "vue", label: "Vue.js" },
  { value: "django", label: "Django" },
  { value: "spring", label: "Spring Boot" },
  { value: "express", label: "Express.js" },
  { value: "laravel", label: "Laravel" },
  { value: "nodejs", label: "Node.js" },
  { value: "dotnet", label: ".NET" },
  { value: "php", label: "PHP" },
  { value: "android", label: "Android" },
  { value: "ios", label: "iOS" },
  { value: "firebase", label: "Firebase" },
  { value: "aws", label: "Amazon Web Services" },
  { value: "azure", label: "Microsoft Azure" },
  { value: "aws", label: "Amazon Web Services" },
  { value: "azure", label: "Microsoft Azure" },
  { value: "gcp", label: "Google Cloud Platform" },
  { value: "heroku", label: "Heroku" },
  { value: "digitalocean", label: "DigitalOcean" },
  { value: "netlify", label: "Netlify" },
  { value: "mysql", label: "MySQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "redis", label: "Redis" },
  { value: "dynamodb", label: "Amazon DynamoDB" },
  { value: "firebase", label: "Firebase Realtime Database" },
  { value: "rest", label: "RESTful API" },
  { value: "graphql", label: "GraphQL" },
  { value: "soap", label: "SOAP" },
  { value: "jsonrpc", label: "JSON-RPC" },
  { value: "grpc", label: "gRPC" },
  { value: "oauth", label: "OAuth" },
  { value: "jwt", label: "JSON Web Tokens (JWT)" },
  { value: "openapi", label: "OpenAPI" },
];

async function main() {
  // Perform seeding operations using Prisma
  await prisma.notification.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.hackathon.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.userPreference.deleteMany({});

  
  const createdUserPreferences = await prisma.userPreference.createMany({
    data: [{}, {}, {}],
  });

  const createdUsers = await prisma.user.createMany({
    data: [
      {
        name: "Ben Cao",
        password: await hash("123456", 10),
        email: "benc.netrascale@gmail.com",
        isAdmin: true,
      },
      {
        name: "Denis nwanshi",
        password: await hash("12345678", 10),
        email: "denis.nwanshi@netrascale.com",
        isAdmin: true,
      },
      {
        name: "Ben Cao",
        password: await hash("1234567890s!", 10),
        email: "cby204@gmail.com",
        isAdmin: false,
      },
    ],
    skipDuplicates: true,
  });

  await prisma.user.update({
    where: { email: "cby204@gmail.com" },
    data: {
      userPreference: {
        create: {
          role: {
            label: "Full-stack developer",
            value: "Full-stack developer",
          },
          skills: [
            { label: "Python", value: "python" },
            { label: "JavaScript", value: "javascript" },
          ],
          avatar: null,
          company: "ABC Inc.",
        },
      },
    },
  });

  await prisma.user.update({
    where: { email: "denis.nwanshi@netrascale.com" },
    data: {
      userPreference: {},
    },
  });

  await prisma.user.update({
    where: { email: "benc.netrascale@gmail.com" },
    data: {
      userPreference: {},
    },
  });

  const users = await prisma.user.findMany({
    where: {
      isAdmin: true,
    },
  });

  await prisma.hackathon.createMany({
    data: [
      {
        name: "Virtual Inter-University Coding Hackathon1",
        description:
          '<h2>🎉🎉Welcome to the Netralabs University-Business Hackathon Summer 2023!🎉🎉</h2><p><br></p><p><span class="ql-size-large">An exciting event where students will have the opportunity to tackle pressing societal and business problems using out of the box thinking, cutting-edge technologies and a disruptive mindset.</span></p><p><br></p><p><span class="ql-size-large">The event takes place between 28 - 29 June 2023 and is open to students and tech professionals around the world. See the full programme on the subsequent slides.</span></p><p><br></p><p><span class="ql-size-large">On the Day 1 of the hackathon, five thematic challenges will be announced for teams to choose from. These challenges are designed to address critical issues and encourage participants to apply their skills and creativity in innovative ways.</span></p>',
        rules: `<h5><strong class="ql-size-large">1. Dates and Timing</strong></h5><p>Submission Period: May 8, 2023 (12:00 pm Eastern Time) – July 3, 2023 (5:00 pm Eastern Time) (“Submission Period”).</p><p>Judging Period: July 6, 2023 (10:00 am Eastern Time) – July 20, 2023 (5:00 pm Eastern Time) (“Judging Period”).</p><p>Winners Announced: On or around July 25, 2023 (3:00 pm Eastern Time).</p><p>&nbsp;</p><h5><strong class="ql-size-large">2. Sponsor and Administrator</strong></h5><p>Sponsor: Fantom Operations Ltd, Cayman Financial Centre, 36A Dr Roy's Drive, George Town, Grand Cayman, KY1-1104, Cayman Islands&nbsp;</p><p>Administrator: Devpost, Inc. (“Devpost”), 222 Broadway, Floor 19, New York, NY 10038</p><p>&nbsp;</p><h5><strong class="ql-size-large">3. Eligibility</strong></h5><ol><li>The Hackathon IS open to:&nbsp;</li></ol><ul><li class="ql-indent-1">Individuals who are at least the age of majority where they reside as of the time of entry (“Eligible Individuals”);</li><li class="ql-indent-1">Teams of Eligible Individuals (“Teams”); and</li><li>Organizations (including corporations, not-for-profit corporations and other nonprofit organizations, limited liability companies, partnerships, and other legal entities) that exist and have been organized or incorporated at the time of entry.</li><li class="ql-indent-1">(the above are collectively, “Entrants”)</li></ul><p>An Eligible Individual may join more than one Team or Organization and an Eligible Individual who is part of a Team or Organization may also enter the Hackathon on an individual basis.&nbsp;If a Team or Organization is entering the Hackathon, they must appoint and authorize one individual (the “Representative”) to represent, act, and enter a Submission, on their behalf. By entering a Submission on behalf of a Team or Organization you represent and warrant that you are the Representative authorized to act on behalf of your Team or Organization.</p><ol><li>The Hackathon IS NOT open to:&nbsp;</li></ol><ul><li class="ql-indent-1">Individuals who are residents of, or Organizations domiciled in, a country, state, province or territory where the laws of the United States or local law prohibits participating or receiving a prize in the Hackathon (including, but not limited to, Brazil, Quebec, Russia, Crimea, Cuba, Iran, North Korea, Syria and any other country designated by the United States Treasury's Office of Foreign Assets Control)&nbsp;</li><li class="ql-indent-1">Organizations involved with the design, production, paid promotion, execution, or distribution of the Hackathon, including the Sponsor and Administrator (“Promotion Entities”).</li><li class="ql-indent-1">Employees, representatives and agents** of such Promotion Entities, and all members of their immediate family or household*</li><li class="ql-indent-1">Any other individual involved with the design, production, promotion, execution, or distribution of the Hackathon, and each member of their immediate family or household*</li><li class="ql-indent-1">Any Judge (defined below), or company or individual that employs a Judge</li><li class="ql-indent-1">Any parent company, subsidiary, or other affiliate*** of any organization described above</li><li class="ql-indent-1">Any other individual or organization whose participation in the Hackathon would create, in the sole discretion of the Sponsor and/or Administrator, a real or apparent conflict of interest&nbsp;</li></ul><p>*The members of an individual’s immediate family include the individual’s spouse, children and stepchildren, parents and stepparents, and siblings and stepsiblings. The members of an individual’s household include any other person that shares the same residence as the individual for at least three (3) months out of the year.&nbsp;</p><p>**Agents include&nbsp;individuals or organizations that in creating a Submission to the Hackathon, are acting on behalf of, and at the direction of, a&nbsp;Promotion Entity through a contractual or similar relationship.</p><p>***An affiliate is:&nbsp;(a) an organization that is under common control, sharing a common majority or&nbsp;controlling owner, or common management; or (b) an&nbsp;organization that has a substantial ownership in, or is substantially owned by the other organization.</p><p>&nbsp;</p><h5><strong class="ql-size-large">4. How To Enter</strong></h5><p>&nbsp;</p><p>Entrants may enter by visiting https://fantomq22023.devpost.com (“Hackathon Website”) and following the below steps:</p><ol><li>Register for the Hackathon on the Hackathon Website by clicking the “Join Hackathon” button. To complete registration, sign up to create a free Devpost account, or log in with an existing Devpost account. This will enable you to receive important updates and to create your Submission.</li><li>Entrants will obtain access to the required developer tools/platform and complete a Project described below in Project Requirements. Use of the developer tools will be subject to the license agreement related thereto. Entry in the Hackathon constitutes consent for the Sponsor and Devpost to collect and maintain an entrant’s personal information for the purpose of operating and publicizing the Hackathon.</li><li>Create a video that includes footage that explains your project’s features and functionality through a comprehensive demonstration.</li><li>Complete and enter all of the required fields on the “Enter a Submission” page of the Hackathon Website (each a “Submission”) during the Submission Period and follow the requirements below.</li></ol><h5>Project Requirements</h5><ol><li>What to Create: Entrants must create a new working software application that integrates with the Fantom mainnet blockchain (each a “Project”).&nbsp;</li><li>Functionality: The Project must be deployed and verified on the Fantom mainnet and be capable of being successfully deployed and running consistently on the platform for which it is intended. The project must function as depicted in the video and/or expressed in the text description.</li><li>Platforms: A submitted Project must run on the platform for which it is intended and which is specified in the Submission Requirements.&nbsp;</li><li>No Pre-Existing Projects: Projects must be newly created by the Entrant after the start of the Hackathon Submission Period.</li><li>Third Party Integrations: If a Project integrates any third-party SDK, APIs and/or data, Entrant must be authorized to use them.</li><li>Testing: The Entrant must make the Project available free of charge and without any restriction, for testing, evaluation and use by the Sponsor, Administrator and Judges until the Judging Period ends.&nbsp;</li></ol><p>If the Project includes software that runs on proprietary or third party hardware that is not widely available to the public, including software running on devices or wearable technology other than smartphones, tablets, or desktop computers, the Sponsor and/or Administrator reserve the right, at their sole discretion, to require the Entrant to provide physical access to the Project hardware upon request.</p><h5><strong class="ql-size-large">Submission Requirements.&nbsp;</strong></h5><p>Submissions to the Hackathon must meet the following requirements:</p><ol><li>Include a Project built with the required developer tools and meets the above Project Requirements.</li><li>Provide a URL to your code repository for judging and testing. Provide access by making it public or sharing with testing@devpost.com and dev@fantom.foundation.</li><li>Optional: Identify which track your Project is being submitted into. See eligibility details under the prize table.</li><li>Optional: Identify which Sponsor prize your Project is being submitted to. See eligibility details under the prize table.</li><li>Include a text description that should explain the features and functionality of your Project.</li><li>Provide a URL from&nbsp;<a href="https://ftmscan.com/" rel="noopener noreferrer" target="_blank">https://ftmscan.com/</a>&nbsp;to the contracts running within the project. The contracts for the Project must be deployed, verified, and publicly readable on the Fantom Mainnet.</li><li>Include a demonstration video of your Project. The video portion of the submission:</li></ol><ul><li class="ql-indent-1">should not exceed three (3) minutes</li><li class="ql-indent-1">should include footage that shows the Project functioning on the device for which it was built</li><li class="ql-indent-1">must be uploaded to and made publicly visible on YouTube, Vimeo, Facebook Video, or Youku, and a link to the video must be provided on the submission form on the Hackathon Website; and</li><li class="ql-indent-1">must not include third party trademarks, or copyrighted music or other material unless the Entrant has permission to use such material.</li></ul><ol><li>Optional: Share your progress and collect feedback within the Fantom community (Discord or Twitter). Document your efforts within your Submission to help you score extra credit on the Judging Criteria “Fantom Engagement”.</li><li>Be the original work of the submitter, be solely owned by the submitter, and not violate the IP rights of any other person or entity.</li><li>Access must be provided to an Entrant’s working Project for judging and testing by providing a link to a website, functioning demo, or a test build. If Entrant’s website is private, Entrant must include login credentials in its testing instructions.</li><li>Multiple Submissions: An Entrant may submit more than one Submission, however, each submission must be unique and substantially different from each of the Entrant’s other Submissions, as determined by the Sponsor and Devpost in their sole discretion.</li></ol><p>Language Requirements</p><p>All Submission materials must be in English or, if not in English, the Entrant must provide an English translation of the demonstration video, text description, and testing instructions as well as all other materials submitted.&nbsp;</p><p>Team Representation</p><p>If a team or organization is entering the Hackathon, they must appoint and authorize one individual (the “Representative”) to represent, act, and enter a Submission, on their behalf. The Representative must meet the eligibility requirements above. By entering a Submission on the Hackathon Website on behalf of a team or organization you represent and warrant that you are the Representative authorized to act on behalf of your team or organization.</p><p>Intellectual Property: Your Submission must: (a) be your (or your Team, or Organization’s) original work product; (b) be solely owned by you, your Team, your Organization with no other person or entity having any right or interest in it; and (c) not violate the intellectual property rights or other rights including but not limited to copyright, trademark, patent, contract, and/or privacy rights, of any other person or entity. An Entrant may contract with a third party for technical assistance to create the Submission provided the Submission components are solely the Entrant’s work product and the result of the Entrant’s ideas and creativity, and the Entrant owns all rights to them. An Entrant may submit a Submission that includes the use of open source software or hardware, provided the Entrant complies with applicable open source licenses and, as part of the Submission, creates software that enhances and builds upon the features and functionality included in the underlying open source product. By entering the Hackathon, you represent, warrant, and agree that your Submission meets these requirements.</p><p>Financial or Preferential Support: A Project must not have been developed, or derived from a Project developed, with financial or preferential support from the Sponsor or Administrator. Such Projects include, but are not limited to, those that received funding or investment for their development, were developed under contract, or received a commercial license, from the Sponsor or Administrator any time prior to the end of Hackathon Submission Period. The Sponsor, at their sole discretion, may disqualify a Project, if awarding a prize to the Project would create a real or apparent conflict of interest.</p><p><br></p><h5><strong class="ql-size-large">5. Submission Modifications.</strong></h5><ol><li>Draft Submissions: Prior to the end of the Submission Period, you may save draft versions of your submission on Devpost to your portfolio before submitting the submission materials to the Hackathon for evaluation. Once the Submission Period has ended, you may not make any changes or alterations to your submission, but you may continue to update the project in your Devpost portfolio.</li><li>Modifications: After the Submission Period. The Sponsor and Devpost may permit you to modify part of your submission after the Submission Period for the purpose of adding, removing or replacing material that potentially infringes a third party mark or right, discloses personally identifiable information, or is otherwise inappropriate. The modified submission must remain substantively the same as the original submission with the only modification being what the Sponsor and Devpost permits.&nbsp;</li></ol><p>&nbsp;</p><h5><strong class="ql-size-large">6. Judges &amp; Criteria.</strong></h5><p>Eligible submissions will be evaluated by a panel of judges selected by the Sponsor (the “Judges”). Judges may be employees of the sponsor or third parties, may or may not be listed individually on the Hackathon Website, and may change before or during the Judging Period. Judging may take place in one or more rounds with one or more panels of Judges, at the discretion of the sponsor.&nbsp;</p><p>Stage One)&nbsp;The first stage will determine via pass/fail whether the ideas meet a baseline level of viability, in that the project reasonably fits the theme and reasonably applies the required APIs/SDKs featured in the Hackathon.</p><p>Stage Two)&nbsp;All submissions that pass Stage One will be evaluated in Stage Two based on the following equally weighted criteria (the “Judging Criteria”):</p><p>Entries will be judged on the following equally weighted criteria, and according to the sole and absolute discretion of the judges:</p><ul><li>Technological Implementation: Does the interaction with Fantom demonstrate quality software development?</li><li>Design: Is the user experience and design of the project well thought out?</li><li>Potential Impact: How big of an impact could the project have on the blockchain industry?</li><li>Quality of the Idea: How creative and unique is the project?</li><li>Fantom Engagement: Did the team engage with the Fantom community to collect feedback or share progress about their project?</li></ul><p>The scores from the Judges will determine the potential winners of the applicable prizes. The Entrant(s) that are eligible for a Prize, and whose Submissions earn the highest overall scores based on the applicable Judging Criteria, will become potential winners of that Prize.</p><p>Tie Breaking. For each Prize listed below, if two or more submissions are tied, the tied submission with the highest score in the first applicable criterion listed above will be considered the higher scoring submission. In the event any ties remain, this process will be repeated, as needed, by comparing the tied Submissions’ scores on the next applicable criterion. If two or more submissions are tied on all applicable criteria, the panel of Judges will vote on the tied submissions.</p><p>Submission Review: Judges may choose to judge based solely on the text description, images and video provided in the Submission.</p><p><strong><span class="ql-cursor">﻿</span></strong></p><h5><strong class="ql-size-large">7. Intellectual Property Rights.</strong></h5><p>All submissions remain the intellectual property of the individuals or organizations that developed them. By submitting an entry, entrants agree that the sponsor will have a fully paid, non-exclusive license to use such entry for judging the entry. Entrants agree that the sponsor and Devpost shall have the right to promote the submission and use the name, likeness, voice and image of all individuals contributing to a submission, in any materials promoting or publicizing the Hackathon and its results, during the Hackathon Period and for three years thereafter.&nbsp;Some Submission components may be displayed to the public. Other Submission materials may be viewed by the sponsor, Devpost, and judges for screening and evaluation. By submitting an entry or accepting any prize, entrants represent and warrant that (a) submitted content is not copyrighted, protected by trade secret or otherwise subject to third party intellectual property rights or other proprietary rights, including privacy and publicity rights, unless entrant is the owner of such rights or has permission from their rightful owner to post the content; and (b) the content submitted does not contain any viruses, Trojan horses, worms, spyware or other disabling devices or harmful or malicious code.</p>`,
        tagline: "Join us for an exciting hackathon!",
        managerEmail: "benc.netrascale@gmail.com",
        location: "Toronto, Ontario, Canada",
        requirements: "",
        about: "",
        judges: "",
        company: "",
        resources: "",
        timeZone: "",
        creatorId: users[0].id,
      },
      {
        name: "Virtual Inter-University Coding Hackathon6",
        description:
          '<h2>>🎉🎉Welcome to the NetraLabs University-Business Hackathon Summer 2023!🎉🎉</h2><p><br></p><p><span class="ql-size-large">An exciting event where students will have the opportunity to tackle pressing societal and business problems using out of the box thinking, cutting-edge technologies and a disruptive mindset.</span></p><p><br></p><p><span class="ql-size-large">The event takes place between 28 - 29 June 2023 and is open to students and tech professionals around the world. See the full programme on the subsequent slides.</span></p><p><br></p><p><span class="ql-size-large">On the Day 1 of the hackathon, five thematic challenges will be announced for teams to choose from. These challenges are designed to address critical issues and encourage participants to apply their skills and creativity in innovative ways.</span></p>',
        rules: `<h5><strong class="ql-size-large">1. Dates and Timing</strong></h5><p>Submission Period: May 8, 2023 (12:00 pm Eastern Time) – July 3, 2023 (5:00 pm Eastern Time) (“Submission Period”).</p><p>Judging Period: July 6, 2023 (10:00 am Eastern Time) – July 20, 2023 (5:00 pm Eastern Time) (“Judging Period”).</p><p>Winners Announced: On or around July 25, 2023 (3:00 pm Eastern Time).</p><p>&nbsp;</p><h5><strong class="ql-size-large">2. Sponsor and Administrator</strong></h5><p>Sponsor: Fantom Operations Ltd, Cayman Financial Centre, 36A Dr Roy's Drive, George Town, Grand Cayman, KY1-1104, Cayman Islands&nbsp;</p><p>Administrator: Devpost, Inc. (“Devpost”), 222 Broadway, Floor 19, New York, NY 10038</p><p>&nbsp;</p><h5><strong class="ql-size-large">3. Eligibility</strong></h5><ol><li>The Hackathon IS open to:&nbsp;</li></ol><ul><li class="ql-indent-1">Individuals who are at least the age of majority where they reside as of the time of entry (“Eligible Individuals”);</li><li class="ql-indent-1">Teams of Eligible Individuals (“Teams”); and</li><li>Organizations (including corporations, not-for-profit corporations and other nonprofit organizations, limited liability companies, partnerships, and other legal entities) that exist and have been organized or incorporated at the time of entry.</li><li class="ql-indent-1">(the above are collectively, “Entrants”)</li></ul><p>An Eligible Individual may join more than one Team or Organization and an Eligible Individual who is part of a Team or Organization may also enter the Hackathon on an individual basis.&nbsp;If a Team or Organization is entering the Hackathon, they must appoint and authorize one individual (the “Representative”) to represent, act, and enter a Submission, on their behalf. By entering a Submission on behalf of a Team or Organization you represent and warrant that you are the Representative authorized to act on behalf of your Team or Organization.</p><ol><li>The Hackathon IS NOT open to:&nbsp;</li></ol><ul><li class="ql-indent-1">Individuals who are residents of, or Organizations domiciled in, a country, state, province or territory where the laws of the United States or local law prohibits participating or receiving a prize in the Hackathon (including, but not limited to, Brazil, Quebec, Russia, Crimea, Cuba, Iran, North Korea, Syria and any other country designated by the United States Treasury's Office of Foreign Assets Control)&nbsp;</li><li class="ql-indent-1">Organizations involved with the design, production, paid promotion, execution, or distribution of the Hackathon, including the Sponsor and Administrator (“Promotion Entities”).</li><li class="ql-indent-1">Employees, representatives and agents** of such Promotion Entities, and all members of their immediate family or household*</li><li class="ql-indent-1">Any other individual involved with the design, production, promotion, execution, or distribution of the Hackathon, and each member of their immediate family or household*</li><li class="ql-indent-1">Any Judge (defined below), or company or individual that employs a Judge</li><li class="ql-indent-1">Any parent company, subsidiary, or other affiliate*** of any organization described above</li><li class="ql-indent-1">Any other individual or organization whose participation in the Hackathon would create, in the sole discretion of the Sponsor and/or Administrator, a real or apparent conflict of interest&nbsp;</li></ul><p>*The members of an individual’s immediate family include the individual’s spouse, children and stepchildren, parents and stepparents, and siblings and stepsiblings. The members of an individual’s household include any other person that shares the same residence as the individual for at least three (3) months out of the year.&nbsp;</p><p>**Agents include&nbsp;individuals or organizations that in creating a Submission to the Hackathon, are acting on behalf of, and at the direction of, a&nbsp;Promotion Entity through a contractual or similar relationship.</p><p>***An affiliate is:&nbsp;(a) an organization that is under common control, sharing a common majority or&nbsp;controlling owner, or common management; or (b) an&nbsp;organization that has a substantial ownership in, or is substantially owned by the other organization.</p><p>&nbsp;</p><h5><strong class="ql-size-large">4. How To Enter</strong></h5><p>&nbsp;</p><p>Entrants may enter by visiting https://fantomq22023.devpost.com (“Hackathon Website”) and following the below steps:</p><ol><li>Register for the Hackathon on the Hackathon Website by clicking the “Join Hackathon” button. To complete registration, sign up to create a free Devpost account, or log in with an existing Devpost account. This will enable you to receive important updates and to create your Submission.</li><li>Entrants will obtain access to the required developer tools/platform and complete a Project described below in Project Requirements. Use of the developer tools will be subject to the license agreement related thereto. Entry in the Hackathon constitutes consent for the Sponsor and Devpost to collect and maintain an entrant’s personal information for the purpose of operating and publicizing the Hackathon.</li><li>Create a video that includes footage that explains your project’s features and functionality through a comprehensive demonstration.</li><li>Complete and enter all of the required fields on the “Enter a Submission” page of the Hackathon Website (each a “Submission”) during the Submission Period and follow the requirements below.</li></ol><h5>Project Requirements</h5><ol><li>What to Create: Entrants must create a new working software application that integrates with the Fantom mainnet blockchain (each a “Project”).&nbsp;</li><li>Functionality: The Project must be deployed and verified on the Fantom mainnet and be capable of being successfully deployed and running consistently on the platform for which it is intended. The project must function as depicted in the video and/or expressed in the text description.</li><li>Platforms: A submitted Project must run on the platform for which it is intended and which is specified in the Submission Requirements.&nbsp;</li><li>No Pre-Existing Projects: Projects must be newly created by the Entrant after the start of the Hackathon Submission Period.</li><li>Third Party Integrations: If a Project integrates any third-party SDK, APIs and/or data, Entrant must be authorized to use them.</li><li>Testing: The Entrant must make the Project available free of charge and without any restriction, for testing, evaluation and use by the Sponsor, Administrator and Judges until the Judging Period ends.&nbsp;</li></ol><p>If the Project includes software that runs on proprietary or third party hardware that is not widely available to the public, including software running on devices or wearable technology other than smartphones, tablets, or desktop computers, the Sponsor and/or Administrator reserve the right, at their sole discretion, to require the Entrant to provide physical access to the Project hardware upon request.</p><h5><strong class="ql-size-large">Submission Requirements.&nbsp;</strong></h5><p>Submissions to the Hackathon must meet the following requirements:</p><ol><li>Include a Project built with the required developer tools and meets the above Project Requirements.</li><li>Provide a URL to your code repository for judging and testing. Provide access by making it public or sharing with testing@devpost.com and dev@fantom.foundation.</li><li>Optional: Identify which track your Project is being submitted into. See eligibility details under the prize table.</li><li>Optional: Identify which Sponsor prize your Project is being submitted to. See eligibility details under the prize table.</li><li>Include a text description that should explain the features and functionality of your Project.</li><li>Provide a URL from&nbsp;<a href="https://ftmscan.com/" rel="noopener noreferrer" target="_blank">https://ftmscan.com/</a>&nbsp;to the contracts running within the project. The contracts for the Project must be deployed, verified, and publicly readable on the Fantom Mainnet.</li><li>Include a demonstration video of your Project. The video portion of the submission:</li></ol><ul><li class="ql-indent-1">should not exceed three (3) minutes</li><li class="ql-indent-1">should include footage that shows the Project functioning on the device for which it was built</li><li class="ql-indent-1">must be uploaded to and made publicly visible on YouTube, Vimeo, Facebook Video, or Youku, and a link to the video must be provided on the submission form on the Hackathon Website; and</li><li class="ql-indent-1">must not include third party trademarks, or copyrighted music or other material unless the Entrant has permission to use such material.</li></ul><ol><li>Optional: Share your progress and collect feedback within the Fantom community (Discord or Twitter). Document your efforts within your Submission to help you score extra credit on the Judging Criteria “Fantom Engagement”.</li><li>Be the original work of the submitter, be solely owned by the submitter, and not violate the IP rights of any other person or entity.</li><li>Access must be provided to an Entrant’s working Project for judging and testing by providing a link to a website, functioning demo, or a test build. If Entrant’s website is private, Entrant must include login credentials in its testing instructions.</li><li>Multiple Submissions: An Entrant may submit more than one Submission, however, each submission must be unique and substantially different from each of the Entrant’s other Submissions, as determined by the Sponsor and Devpost in their sole discretion.</li></ol><p>Language Requirements</p><p>All Submission materials must be in English or, if not in English, the Entrant must provide an English translation of the demonstration video, text description, and testing instructions as well as all other materials submitted.&nbsp;</p><p>Team Representation</p><p>If a team or organization is entering the Hackathon, they must appoint and authorize one individual (the “Representative”) to represent, act, and enter a Submission, on their behalf. The Representative must meet the eligibility requirements above. By entering a Submission on the Hackathon Website on behalf of a team or organization you represent and warrant that you are the Representative authorized to act on behalf of your team or organization.</p><p>Intellectual Property: Your Submission must: (a) be your (or your Team, or Organization’s) original work product; (b) be solely owned by you, your Team, your Organization with no other person or entity having any right or interest in it; and (c) not violate the intellectual property rights or other rights including but not limited to copyright, trademark, patent, contract, and/or privacy rights, of any other person or entity. An Entrant may contract with a third party for technical assistance to create the Submission provided the Submission components are solely the Entrant’s work product and the result of the Entrant’s ideas and creativity, and the Entrant owns all rights to them. An Entrant may submit a Submission that includes the use of open source software or hardware, provided the Entrant complies with applicable open source licenses and, as part of the Submission, creates software that enhances and builds upon the features and functionality included in the underlying open source product. By entering the Hackathon, you represent, warrant, and agree that your Submission meets these requirements.</p><p>Financial or Preferential Support: A Project must not have been developed, or derived from a Project developed, with financial or preferential support from the Sponsor or Administrator. Such Projects include, but are not limited to, those that received funding or investment for their development, were developed under contract, or received a commercial license, from the Sponsor or Administrator any time prior to the end of Hackathon Submission Period. The Sponsor, at their sole discretion, may disqualify a Project, if awarding a prize to the Project would create a real or apparent conflict of interest.</p><p><br></p><h5><strong class="ql-size-large">5. Submission Modifications.</strong></h5><ol><li>Draft Submissions: Prior to the end of the Submission Period, you may save draft versions of your submission on Devpost to your portfolio before submitting the submission materials to the Hackathon for evaluation. Once the Submission Period has ended, you may not make any changes or alterations to your submission, but you may continue to update the project in your Devpost portfolio.</li><li>Modifications: After the Submission Period. The Sponsor and Devpost may permit you to modify part of your submission after the Submission Period for the purpose of adding, removing or replacing material that potentially infringes a third party mark or right, discloses personally identifiable information, or is otherwise inappropriate. The modified submission must remain substantively the same as the original submission with the only modification being what the Sponsor and Devpost permits.&nbsp;</li></ol><p>&nbsp;</p><h5><strong class="ql-size-large">6. Judges &amp; Criteria.</strong></h5><p>Eligible submissions will be evaluated by a panel of judges selected by the Sponsor (the “Judges”). Judges may be employees of the sponsor or third parties, may or may not be listed individually on the Hackathon Website, and may change before or during the Judging Period. Judging may take place in one or more rounds with one or more panels of Judges, at the discretion of the sponsor.&nbsp;</p><p>Stage One)&nbsp;The first stage will determine via pass/fail whether the ideas meet a baseline level of viability, in that the project reasonably fits the theme and reasonably applies the required APIs/SDKs featured in the Hackathon.</p><p>Stage Two)&nbsp;All submissions that pass Stage One will be evaluated in Stage Two based on the following equally weighted criteria (the “Judging Criteria”):</p><p>Entries will be judged on the following equally weighted criteria, and according to the sole and absolute discretion of the judges:</p><ul><li>Technological Implementation: Does the interaction with Fantom demonstrate quality software development?</li><li>Design: Is the user experience and design of the project well thought out?</li><li>Potential Impact: How big of an impact could the project have on the blockchain industry?</li><li>Quality of the Idea: How creative and unique is the project?</li><li>Fantom Engagement: Did the team engage with the Fantom community to collect feedback or share progress about their project?</li></ul><p>The scores from the Judges will determine the potential winners of the applicable prizes. The Entrant(s) that are eligible for a Prize, and whose Submissions earn the highest overall scores based on the applicable Judging Criteria, will become potential winners of that Prize.</p><p>Tie Breaking. For each Prize listed below, if two or more submissions are tied, the tied submission with the highest score in the first applicable criterion listed above will be considered the higher scoring submission. In the event any ties remain, this process will be repeated, as needed, by comparing the tied Submissions’ scores on the next applicable criterion. If two or more submissions are tied on all applicable criteria, the panel of Judges will vote on the tied submissions.</p><p>Submission Review: Judges may choose to judge based solely on the text description, images and video provided in the Submission.</p><p><strong><span class="ql-cursor">﻿</span></strong></p><h5><strong class="ql-size-large">7. Intellectual Property Rights.</strong></h5><p>All submissions remain the intellectual property of the individuals or organizations that developed them. By submitting an entry, entrants agree that the sponsor will have a fully paid, non-exclusive license to use such entry for judging the entry. Entrants agree that the sponsor and Devpost shall have the right to promote the submission and use the name, likeness, voice and image of all individuals contributing to a submission, in any materials promoting or publicizing the Hackathon and its results, during the Hackathon Period and for three years thereafter.&nbsp;Some Submission components may be displayed to the public. Other Submission materials may be viewed by the sponsor, Devpost, and judges for screening and evaluation. By submitting an entry or accepting any prize, entrants represent and warrant that (a) submitted content is not copyrighted, protected by trade secret or otherwise subject to third party intellectual property rights or other proprietary rights, including privacy and publicity rights, unless entrant is the owner of such rights or has permission from their rightful owner to post the content; and (b) the content submitted does not contain any viruses, Trojan horses, worms, spyware or other disabling devices or harmful or malicious code.</p>`,
        tagline: "Join us for an exciting hackathon!",
        managerEmail: "denis.nwanshi@gmail.com",
        location: "Toronto, Ontario, Canada",
        requirements: "",
        about: "",
        judges: "",
        company: "",
        resources: "",
        timeZone: "",
        creatorId: users[1].id,
      },
    ],
  });

  console.log("Seeding completed successfully.");
}

const generateUsers = async () => {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const role = roles[Math.floor(Math.random() * roles.length)];
  const numberOfSkills = faker.number.int({ min: 1, max: 10 });
  const selectedSkills = faker.helpers.shuffle(skills).slice(0, numberOfSkills);

  const userData = {
    name: `${firstName} ${lastName}`,
    password: await hash("test1234", 10),
    email: email,
    isAdmin: false,
  };

  const userPreferences = {
    role: role,
    skills: selectedSkills,
  };

  const user = await prisma.user.create({
    data: {
      ...userData,
      userPreference: {
        create: userPreferences,
      },
    },
  });

  console.log(`Created user with preference: ${user.name}`);
};

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
