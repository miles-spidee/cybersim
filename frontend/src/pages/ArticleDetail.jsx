import React, { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Rocket,
  Copy,
  ChevronDown,
  ChevronUp,
  Database,
  Shield,
  Zap,
} from "lucide-react";


/* ----------------------- Utility ----------------------- */
const copyToClipboard = async (text, setMsg) => {
  try {
    await navigator.clipboard.writeText(text);
    setMsg("Copied!");
    setTimeout(() => setMsg(""), 1500);
  } catch {
    setMsg("Failed to copy");
    setTimeout(() => setMsg(""), 1500);
  }
};


/* ----------------------- Main Component ----------------------- */
export default function ArticleDetail() {
  const { topic } = useParams();
  const navigate = useNavigate();


  const [progress, setProgress] = useState(0);


  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      setProgress((scrollTop / docHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  /* ----------------------- Articles Data ----------------------- */
  const ARTICLES = useMemo(
    () => ({
      "os-hardening": {
        title: "🛡️ OS Hardening — Complete A→Z Guide",
        category: "Defense",
        heroGradient: "from-cyan-600 to-blue-700",
        sections: [
          {
            id: "what",
            title: "What is OS Hardening?",
            body:
              "Operating System Hardening is the comprehensive process of securing an operating system by systematically reducing its attack surface. This involves disabling unused services and features, tightening file and directory permissions, applying the latest security patches, enforcing strict configuration policies, and implementing defense-in-depth security measures.\n\nThink of it like securing a physical building: just as a bank has multiple layers of security—locked doors, security cameras, alarms, safes, and guards—your operating system needs multiple defensive layers. Each layer you add makes it exponentially harder for attackers to breach your system.\n\nThe primary goal of OS hardening is to minimize vulnerabilities and potential entry points that could be exploited by malicious actors, thereby significantly reducing the overall risk exposure of your infrastructure.",
          },
          {
            id: "why",
            title: "Why OS Hardening Matters",
            body:
              "Unhardened systems are essentially open invitations to attackers. They often contain numerous security vulnerabilities including default credentials (like admin/admin), unnecessary open ports that serve as entry points, outdated packages with known exploits, misconfigured services, excessive user privileges, and lack of proper logging mechanisms.\n\nAccording to cybersecurity research, the majority of successful system compromises occur because attackers exploit known vulnerabilities that have not been patched or because systems were left in their default, insecure configurations. Every unnecessary service running on your system is a potential attack vector. Every user account with excessive privileges is a potential escalation point.\n\nProper hardening not only reduces the risk of initial compromise but also limits an attacker's ability to move laterally within your network, escalate privileges, persist in your environment, or exfiltrate sensitive data. It's a critical component of any defense-in-depth security strategy.",
          },
          {
            id: "attack-surface",
            title: "Understanding Attack Surface Reduction",
            body:
              "Your attack surface is the sum of all possible points where an unauthorized user could try to enter or extract data from your system. The larger your attack surface, the more opportunities attackers have to find vulnerabilities.\n\nAttack surface reduction involves: removing or disabling unused software packages and services, closing unnecessary network ports, removing unnecessary user accounts, limiting network exposure through firewalls, disabling unused hardware interfaces (like USB ports on servers), and implementing the principle of least privilege across all system components.\n\nFor example, a default Linux installation might have dozens of services running, from print servers to Bluetooth managers, that a production web server would never need. Each of these services represents additional code that could contain vulnerabilities. By removing them, you're not just closing potential doors—you're removing entire wings of the building that don't need to exist.",
          },
          {
            id: "core-principles",
            title: "Core Hardening Principles (A → Z)",
            list: [
              "🔐 Access Control — Implement strict authentication and authorization mechanisms. Use multi-factor authentication (MFA) wherever possible, enforce strong password policies, and regularly audit user access rights.",
              "🧱 Baseline Configuration — Start from a secure, well-documented baseline configuration. Use industry standards like CIS Benchmarks or DISA STIGs as your foundation, then customize based on your specific security requirements.",
              "🔒 Least Privilege — Grant users and processes only the minimum permissions necessary to perform their functions. This limits the damage that can occur from compromised accounts or applications.",
              "🛡️ Defense in Depth — Implement multiple layers of security controls. If one layer fails, others should still provide protection. Never rely on a single security mechanism.",
              "📝 Logging & Monitoring — Enable comprehensive logging for all security-relevant events. Store logs on a separate, secure system where attackers can't tamper with them. Implement real-time monitoring to detect abnormal behavior and potential security incidents.",
              "🩹 Patch Management — Keep all software components updated with the latest security patches. Establish a regular patching schedule and prioritize critical security updates. Most breaches exploit known vulnerabilities for which patches already exist.",
              "🚫 Service Minimization — Disable or completely remove all unnecessary services, daemons, and applications. The principle is simple: what isn't running can't be exploited. Regularly audit running services and question the necessity of each.",
              "🔐 Encryption Everywhere — Use strong encryption for data at rest (full disk encryption) and data in transit (TLS/SSH). Protect sensitive configuration files and credentials with appropriate encryption methods.",
              "💾 Backup & Recovery — Maintain regular, tested backups stored securely offsite. Ensure you can quickly recover from a compromise. Test your disaster recovery procedures regularly to verify they work when you need them.",
              "🔍 Continuous Auditing — Regularly scan your systems for vulnerabilities, misconfigurations, and compliance issues. Use both automated tools and manual reviews to ensure hardening measures remain effective over time.",
            ],
          },
          {
            id: "server-hardening",
            title: "Server-Level Hardening (Hardware & BIOS)",
            body:
              "Security starts at the lowest level—the physical hardware and firmware. Server hardening establishes a secure foundation upon which everything else is built.\n\nKey server hardening steps include: keeping BIOS/UEFI firmware updated to address security vulnerabilities and hardware exploits; enabling Secure Boot to ensure only cryptographically signed and trusted operating systems can boot on your hardware; setting strong BIOS passwords to prevent unauthorized changes to security settings; disabling unused hardware features like USB ports, serial ports, or network interfaces that aren't required; configuring full disk encryption (LUKS on Linux, BitLocker on Windows) to protect data if physical drives are removed or stolen; and securing remote management interfaces (like IPMI, iLO, or iDRAC) with strong passwords and network isolation.\n\nIn virtualized or cloud environments, these concepts extend to hypervisor hardening and ensuring proper isolation between virtual machines.",
          },
          {
            id: "commands",
            title: "Essential OS Hardening Commands",
            body:
              "Below are practical commands for hardening a Linux system. These represent real-world tasks you'll perform during system hardening. Always test these in a safe environment first and understand their impact before applying to production systems.",
            code: [
              { 
                cmd: "sudo apt update && sudo apt upgrade -y", 
                note: "Update package lists and upgrade all packages to latest secure versions"
              },
              {
                cmd: "sudo apt autoremove && sudo apt autoclean",
                note: "Remove unnecessary packages and clean up package cache",
              },
              { 
                cmd: "sudo ufw enable", 
                note: "Enable UFW firewall with default deny incoming policy" 
              },
              {
                cmd: "sudo ufw default deny incoming && sudo ufw default allow outgoing",
                note: "Set default firewall policies: block incoming, allow outgoing",
              },
              {
                cmd: "sudo ufw allow 22/tcp && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp",
                note: "Allow only necessary ports (SSH, HTTP, HTTPS)",
              },
              {
                cmd: "sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config",
                note: "Disable direct root login via SSH—use sudo instead",
              },
              {
                cmd: "sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config",
                note: "Disable password authentication—enforce SSH key authentication only",
              },
              {
                cmd: "sudo systemctl restart sshd",
                note: "Restart SSH service to apply configuration changes",
              },
              { 
                cmd: "chmod 700 /root && chmod 700 /home/*", 
                note: "Secure home directories—only owners can access their own files" 
              },
              {
                cmd: "sudo find / -nouser -o -nogroup",
                note: "Find files without owners—potential security risk",
              },
              {
                cmd: "sudo systemctl list-units --type=service --state=running",
                note: "List all running services to identify unnecessary ones",
              },
              {
                cmd: "sudo systemctl disable cups bluetooth avahi-daemon",
                note: "Disable unnecessary services (printing, Bluetooth, network discovery)",
              },
              {
                cmd: "sudo aa-enforce /etc/apparmor.d/*",
                note: "Enable AppArmor mandatory access controls for additional security layer",
              },
              {
                cmd: "sudo passwd -l root",
                note: "Lock the root account to prevent any login attempts",
              },
              {
                cmd: "sudo chage -M 90 -m 7 -W 14 username",
                note: "Set password expiry: 90 days max, 7 days min between changes, 14 days warning",
              },
            ],
          },
          {
            id: "user-management",
            title: "User Account & Access Management",
            body:
              "Improper user account management is one of the most common security weaknesses. Attackers frequently exploit accounts with excessive privileges, stale accounts from former employees, or accounts with weak authentication.\n\nBest practices include: implementing the principle of least privilege—users should have only the access they need; using sudo instead of logging in as root directly; regularly auditing user accounts and removing or disabling accounts that are no longer needed; enforcing strong password policies (minimum length, complexity, expiration); implementing multi-factor authentication (MFA) for all administrative access; creating separate accounts for administrative tasks versus day-to-day work; monitoring and logging all privileged actions; and using centralized authentication systems (LDAP, Active Directory) for easier account management.\n\nRemember: every user account is a potential entry point. The fewer accounts you have, and the more restricted their permissions, the smaller your attack surface.",
          },
          {
            id: "network-hardening",
            title: "Network Configuration & Firewall Hardening",
            body:
              "Network hardening focuses on controlling what can communicate with your system and how. An improperly configured network is like leaving your doors and windows open.\n\nKey network hardening measures: implement host-based firewalls (ufw, iptables, firewalld) with default-deny policies; allow only explicitly required ports and services; disable IPv6 if not used to reduce attack surface; configure TCP wrappers (/etc/hosts.allow and /etc/hosts.deny) for additional access control; disable unnecessary network protocols and services; implement network segmentation to isolate critical systems; use VPNs for remote access instead of exposing services directly; enable connection logging and rate limiting to detect and prevent DoS attacks; and regularly scan for open ports using tools like nmap.\n\nYour firewall should follow the principle of 'default deny'—block everything, then explicitly allow only what's necessary for legitimate business operations.",
          },
          {
            id: "monitoring-logging",
            title: "Logging, Monitoring & Incident Detection",
            body:
              "You can't protect what you can't see. Comprehensive logging and monitoring are essential for detecting security incidents, understanding attack patterns, and conducting forensic analysis after a breach.\n\nImplementation strategies: enable logging for all authentication attempts (successful and failed), privilege escalation events, file access to sensitive directories, network connections, and system configuration changes; forward logs to a centralized, secure log server that attackers can't easily access or tamper with; implement log rotation to prevent disk space exhaustion; use Security Information and Event Management (SIEM) tools or log analysis platforms; set up real-time alerts for suspicious activities like multiple failed login attempts, unusual privilege escalations, or access from unexpected locations; deploy file integrity monitoring (AIDE, Tripwire) to detect unauthorized changes to critical system files; and regularly review logs—logs are useless if nobody looks at them.\n\nMany breaches are discovered months after they occur. Proper logging and monitoring can reduce detection time from months to minutes.",
          },
          {
            id: "compliance-standards",
            title: "Security Standards & Compliance Frameworks",
            body:
              "Rather than inventing your own hardening procedures from scratch, leverage established security frameworks and benchmarks developed by security experts.\n\nMajor standards include: CIS Benchmarks (Center for Internet Security)—comprehensive, consensus-based security configuration guidelines for operating systems and applications, available for free; DISA STIGs (Security Technical Implementation Guides)—detailed hardening guidelines used by the U.S. Department of Defense; NIST guidelines—frameworks from the National Institute of Standards and Technology; PCI-DSS requirements—mandatory for organizations handling payment card data; and HIPAA security requirements—mandatory for healthcare organizations handling protected health information.\n\nThese frameworks provide detailed, step-by-step hardening procedures, configuration templates, and automated scanning tools. Tools like Ubuntu Security Guide (USG), OpenSCAP, or Lynis can automatically apply and audit compliance with these standards, saving countless hours of manual configuration while ensuring you don't miss critical security controls.",
          },
          {
            id: "defense-lab",
            title: "How This Maps to the Defense Lab",
            body:
              "In our interactive Defense Lab, you'll apply these OS hardening concepts in a safe, simulated environment. The lab presents you with an unhardened system containing common misconfigurations and vulnerabilities.\n\nYour mission is to systematically harden the system by: configuring the firewall to block unnecessary ports; disabling unused services that expand the attack surface; securing SSH configuration to prevent brute-force attacks; setting proper file and directory permissions; updating packages to patch known vulnerabilities; configuring user accounts with appropriate privileges; enabling security modules like AppArmor or SELinux; and setting up comprehensive logging and monitoring.\n\nEach successful hardening action you complete contributes to the overall security score. When all critical vulnerabilities are addressed, the lab is marked as successfully secured. This hands-on practice reinforces the theoretical concepts and gives you real-world experience with the commands and procedures used by security professionals.\n\nThe skills you develop in the Defense Lab directly translate to securing production systems in enterprise environments.",
          },
        ],
      },


      pentesting: {
        title: "💥 Penetration Testing — A→Z Offensive Guide",
        category: "Attack",
        heroGradient: "from-red-500 to-purple-700",
        sections: [
          {
            id: "what",
            title: "What is Penetration Testing?",
            body:
              "Penetration Testing (commonly called pentesting or ethical hacking) is the authorized, simulated cyberattack against your own systems to identify security vulnerabilities before malicious hackers can exploit them. It's essentially 'thinking like a hacker' to find and fix weaknesses proactively.\n\nUnlike automated vulnerability scanning, penetration testing involves skilled security professionals who use the same tools, techniques, and methodologies as real attackers—but in a controlled, ethical manner with explicit permission. The goal is not just to find vulnerabilities, but to actually exploit them to understand their real-world impact on your organization.\n\nPenetration testing answers critical questions: Can an attacker access our sensitive data? Can they escalate privileges to administrative levels? Can they maintain persistent access? What damage could they cause? It's an essential component of any comprehensive security program and is often required for regulatory compliance (PCI-DSS, HIPAA, SOC 2).",
          },
          {
            id: "importance",
            title: "Why Penetration Testing is Critical",
            body:
              "Organizations face a paradox: they invest heavily in security controls like firewalls, intrusion detection systems, and antivirus software, yet breaches continue to occur. Why? Because having security tools doesn't mean they're properly configured, and automated scanners can't replicate the creativity and persistence of human attackers.\n\nPenetration testing provides several critical benefits: it identifies security weaknesses before attackers do, giving you time to remediate; it validates that your security controls actually work as intended under real attack conditions; it helps prioritize security investments by demonstrating actual exploitability and business impact; it meets compliance requirements for many regulatory frameworks; it trains your security team by exposing them to real attack techniques; and it provides executive leadership with concrete evidence about security posture.\n\nConsider this: a vulnerability scanner might report 'Port 22 is open.' A penetration tester will attempt to actually SSH into that system, test for weak credentials, try to escalate privileges, access sensitive data, and document the business impact. That's the difference between theoretical risk and demonstrated impact.",
          },
          {
            id: "types",
            title: "Types of Penetration Testing",
            body:
              "Different testing approaches provide different perspectives on your security posture.\n\nBlack Box Testing: The tester has no prior knowledge of the target system—simulating an external attacker with no inside information. This tests your perimeter security and what an outsider can discover and exploit.\n\nWhite Box Testing: The tester has complete knowledge of the system—architecture diagrams, source code, credentials. This comprehensive approach finds the maximum number of vulnerabilities and tests whether your defenses can withstand an attacker with insider knowledge.\n\nGray Box Testing: The tester has partial knowledge—perhaps limited user credentials or basic network information. This simulates a common scenario where an attacker has gained some initial foothold and is attempting to expand access.\n\nCommon testing focuses: External Network Penetration Testing (testing internet-facing systems and perimeter defenses); Internal Network Penetration Testing (simulating an insider threat or compromised internal system); Web Application Penetration Testing (identifying vulnerabilities like SQL injection, XSS, authentication flaws); Wireless Network Penetration Testing (testing WiFi security and rogue access points); Social Engineering Testing (testing human vulnerabilities through phishing, pretexting); and Physical Penetration Testing (attempting to gain physical access to facilities).",
          },
          {
            id: "phases",
            title: "Penetration Testing Phases — Complete Methodology",
            list: [
              "🔍 1. Planning & Reconnaissance — Define scope, objectives, and testing methods. Gather intelligence about the target using Open Source Intelligence (OSINT): domain names, IP addresses, email addresses, employee information, technology stack. Use passive reconnaissance (no direct target interaction) and active reconnaissance (direct information gathering like DNS queries). Tools: theHarvester, Maltego, Shodan, Google dorking.",
              "🔎 2. Scanning & Enumeration — Identify live hosts, open ports, running services, and operating systems. Use network scanners to map the attack surface. Enumerate users, shares, and detailed service information. This phase identifies potential entry points. Tools: Nmap for port scanning, Masscan for fast scanning, enum4linux for SMB enumeration, Nikto for web server scanning.",
              "🎯 3. Vulnerability Assessment — Analyze scanning results to identify specific vulnerabilities. Cross-reference discovered services and versions with known vulnerability databases (CVE, NVD). Use automated vulnerability scanners supplemented with manual analysis. Prioritize vulnerabilities based on severity and exploitability. Tools: Nessus, OpenVAS, Burp Suite, SQLmap for database vulnerability testing.",
              "💥 4. Exploitation — Attempt to exploit identified vulnerabilities to gain unauthorized access. Use exploit frameworks and custom exploits. Common exploitation vectors: exploiting unpatched software vulnerabilities, brute-forcing weak authentication, leveraging misconfigurations, exploiting web application flaws (SQL injection, command injection, file upload vulnerabilities). This phase demonstrates actual risk. Tools: Metasploit Framework, custom Python exploits, Burp Suite for web exploitation.",
              "⬆️ 5. Post-Exploitation & Privilege Escalation — After gaining initial access, attempt to escalate privileges from regular user to administrator/root. Establish persistence mechanisms to maintain access. Move laterally to other systems on the network. Search for and exfiltrate sensitive data. The goal is to understand the full extent of potential damage from a successful breach. Techniques: kernel exploits, misconfigured sudo permissions, credential harvesting, pass-the-hash attacks.",
              "📊 6. Analysis & Reporting — Document all findings in a comprehensive report. Include executive summary for business stakeholders, technical details of vulnerabilities discovered, proof-of-concept demonstrations, risk assessment and business impact analysis, detailed remediation recommendations prioritized by severity, and strategic security improvements. The report should be actionable and clearly communicate risks in business terms.",
              "🔄 7. Remediation & Retesting — Work with the organization to fix identified vulnerabilities. After remediation, perform focused retesting to verify fixes are effective and haven't introduced new issues. This closes the loop and ensures security improvements are actually implemented.",
            ],
          },
          {
            id: "reconnaissance-deep",
            title: "Deep Dive: Reconnaissance (Information Gathering)",
            body:
              "Reconnaissance is often the most important phase. Attackers can spend weeks or months gathering information before launching attacks. The more information you gather, the more targeted and effective your attacks can be.\n\nPassive Reconnaissance involves gathering information without directly interacting with the target—analyzing public websites, social media profiles (LinkedIn for employee names and roles), DNS records (using dig, nslookup), WHOIS data, search engine results, public breach databases, job postings (which often reveal technology stack), and metadata from public documents.\n\nActive Reconnaissance involves direct interaction—port scanning, DNS zone transfers, web spidering, banner grabbing (connecting to services to identify versions), and social engineering. This risks detection but provides more detailed information.\n\nOSINT (Open Source Intelligence) has become incredibly powerful. You'd be amazed what's publicly available: exposed databases on Shodan, leaked credentials from previous breaches on Have I Been Pwned, employee information on LinkedIn, code repositories on GitHub that might contain API keys or passwords, and public cloud storage buckets with sensitive data.\n\nSkilled penetration testers can often map an organization's entire infrastructure, identify key personnel, and discover sensitive information without ever directly interacting with target systems. This intelligence gathering informs every subsequent phase of the test.",
          },
          {
            id: "sqli",
            title: "Deep Dive — SQL Injection (Interactive Demonstration)",
            body:
              "SQL Injection (SQLi) remains one of the most critical web application vulnerabilities. It occurs when untrusted user input is inserted directly into SQL queries without proper validation or sanitization, allowing attackers to manipulate database queries to steal data, modify data, or even gain administrative access to the entire database server.\n\nHow SQL Injection Works: Web applications often build SQL queries dynamically using user input. If developers concatenate user input directly into SQL queries, attackers can inject their own SQL commands. For example, entering admin' OR '1'='1 as a username can bypass authentication because it changes the query logic.\n\nReal-World Impact: SQL injection can lead to complete data breaches (stealing millions of customer records), data manipulation (changing prices, balances, or grades), authentication bypass (logging in as any user including administrators), denial of service (deleting or corrupting databases), and remote code execution on the database server.\n\nThe OWASP Top 10 consistently ranks injection vulnerabilities as one of the most critical security risks. Famous breaches caused by SQL injection include Heartland Payment Systems (130 million credit cards stolen), Sony Pictures (millions of accounts compromised), and countless others.\n\nUse the interactive visualizer below to see how malicious input changes query behavior and how parameterized queries prevent this vulnerability.",
            visual: true,
          },
          {
            id: "sqli-prevention",
            title: "SQL Injection Prevention Techniques",
            body:
              "Preventing SQL injection requires secure coding practices that separate SQL code from data.\n\nPrimary Defense - Prepared Statements (Parameterized Queries): This is the gold standard. Instead of concatenating user input into queries, use placeholders that treat input as data only. The database driver automatically handles proper escaping. Available in virtually every programming language and database combination.\n\nSecondary Defenses: Use stored procedures (though they must also use parameterized queries internally); implement strict input validation using allowlists (only permit expected characters and formats); apply the principle of least privilege (database accounts should have minimal necessary permissions—if compromised, the damage is limited); escape special characters if you absolutely must build dynamic queries; implement Web Application Firewalls (WAF) to detect and block SQL injection attempts; conduct regular security testing including automated scanning and manual penetration testing.\n\nWhitelist validation is crucial: if you expect a number, validate it's actually a number before using it in a query. If you expect an email address, validate the email format. Never trust user input.\n\nRemember: input validation is a supplementary defense, not a primary one. Always use parameterized queries as your first line of defense.",
          },
          {
            id: "tools",
            title: "Essential Penetration Testing Tools & Frameworks",
            list: [
              "🗺️ Nmap — The industry-standard network scanner for host discovery, port scanning, service identification, and OS detection. Incredibly versatile with scripting engine (NSE) for automated vulnerability detection. Command: nmap -sV -sC -p- target.com",
              "🌐 Burp Suite — Comprehensive web application security testing platform. Functions as an intercepting proxy to capture and modify HTTP requests. Includes automated scanners, intruder for brute-force attacks, repeater for manual testing, and sequencer for analyzing session token randomness. Essential for testing web apps.",
              "🚀 Metasploit Framework — The world's most popular exploitation framework with thousands of exploits for known vulnerabilities. Includes payload generators, post-exploitation modules, and auxiliary modules for scanning and enumeration. Simplifies the exploitation process but requires understanding of underlying concepts.",
              "📡 Wireshark — Powerful network protocol analyzer for deep packet inspection. Captures and analyzes network traffic in real-time. Essential for understanding network communications, detecting anomalies, analyzing malware behavior, and troubleshooting. Can reveal unencrypted sensitive data on the network.",
              "💉 SQLmap — Automated tool for detecting and exploiting SQL injection vulnerabilities. Supports MySQL, PostgreSQL, Oracle, Microsoft SQL Server, and many others. Can automatically extract database contents, but should be used responsibly in authorized testing only.",
              "🔐 John the Ripper & Hashcat — Password cracking tools using dictionary attacks, brute force, and rainbow tables. Used to test password strength and crack recovered password hashes. Hashcat leverages GPU acceleration for dramatically faster cracking.",
              "🕷️ OWASP ZAP — Free, open-source alternative to Burp Suite. User-friendly with automated scanning capabilities. Great for beginners while still powerful enough for professionals. Active community and regular updates.",
              "🏗️ Aircrack-ng — Suite of tools for wireless network security assessment. Can capture packets, crack WEP/WPA/WPA2 encryption, and test wireless network security. Essential for wireless penetration testing.",
            ],
          },
          {
            id: "methodology",
            title: "Professional Penetration Testing Methodology",
            body:
              "Professional penetration testing follows established methodologies that ensure comprehensive, repeatable, and ethical testing.\n\nMajor Frameworks: OWASP Testing Guide (comprehensive web application testing methodology); PTES (Penetration Testing Execution Standard—detailed technical guidelines); OSSTMM (Open Source Security Testing Methodology Manual); NIST SP 800-115 (Technical Guide to Information Security Testing and Assessment).\n\nKey Principles: Always obtain explicit, written authorization before testing—unauthorized testing is illegal; clearly define scope (what systems, IP ranges, and applications are included/excluded); establish rules of engagement (testing windows, emergency contacts, prohibited actions); maintain detailed notes and screenshots as evidence; practice responsible disclosure of vulnerabilities; understand the difference between theoretical vulnerabilities and actually exploitable ones; assess business impact, not just technical severity; and provide clear, actionable remediation guidance.\n\nEthical Considerations: Penetration testers hold immense responsibility. You'll access sensitive data and could disrupt business operations. Always maintain confidentiality, test only authorized targets, do not exceed authorized scope, minimize potential damage or disruption, and report all findings honestly—even if they reflect poorly on the client's security posture.",
          },
          {
            id: "career",
            title: "Building a Career in Penetration Testing",
            body:
              "Penetration testing is one of the most sought-after specializations in cybersecurity, offering intellectual challenge and competitive compensation.\n\nSkill Requirements: Deep understanding of networking (TCP/IP, routing, protocols); proficiency in multiple operating systems (Linux and Windows administration); programming skills (Python for automation, Bash scripting, understanding of compiled languages); web technologies (HTTP, HTML, JavaScript, modern frameworks); database knowledge (SQL, NoSQL); understanding of security concepts (cryptography, authentication, access controls); and most importantly—a hacker mindset that questions assumptions and thinks creatively about breaking systems.\n\nCertifications: CEH (Certified Ethical Hacker—good for beginners), OSCP (Offensive Security Certified Professional—highly respected, hands-on practical exam), GPEN (GIAC Penetration Tester), CPENT (Certified Penetration Testing Professional), and OSWE (Offensive Security Web Expert—advanced web application pentesting).\n\nLearning Path: Set up home lab environments with virtual machines; practice on legal platforms like HackTheBox, TryHackMe, VulnHub; participate in Capture The Flag (CTF) competitions; study published penetration testing reports; contribute to security communities and open-source projects; stay current with security research and new vulnerabilities; and practice, practice, practice—pentesting is a skill that improves with hands-on experience.",
          },
          {
            id: "attack-lab",
            title: "How This Maps to the Attack Lab",
            body:
              "Our interactive SQL Injection Lab provides hands-on experience with one of the most critical and prevalent web application vulnerabilities. You'll practice in a safe, legal environment specifically designed for learning.\n\nIn the lab, you'll: understand how web applications construct SQL queries; craft malicious SQL payloads that manipulate query logic; bypass authentication mechanisms using SQL injection; extract sensitive data from databases; observe the difference between vulnerable and properly secured code; learn to recognize SQL injection vulnerabilities in code review; and understand how to implement proper defenses using parameterized queries.\n\nYou'll start with simple injections and progress to more complex scenarios. Each successful exploitation provides immediate feedback, showing exactly how your payload affected the underlying query and what data was retrieved. The interactive visualizer lets you experiment with different inputs and see in real-time how they change the SQL query.\n\nThe skills you develop translate directly to professional penetration testing engagements. SQL injection testing is a core component of every web application security assessment, and understanding both attack and defense perspectives makes you a more effective security professional.\n\nRemember: what you learn here should only be applied to systems you have explicit permission to test. Unauthorized testing is illegal and unethical.",
          },
        ],
      },
    }),
    []
  );


  const article = ARTICLES[topic];


  /* ----------------------- 404 Handler ----------------------- */
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#020617] to-[#061226] p-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-xl">
          <h2 className="text-2xl text-red-300 mb-4">Article not found</h2>
          <p className="text-gray-300 mb-6">
            The requested topic doesn't exist. Go back to the articles list.
          </p>
          <button
            onClick={() => navigate("/articles")}
            className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md font-semibold hover:opacity-90"
          >
            ← Back to Articles
          </button>
        </div>
      </div>
    );
  }


  /* ----------------------- Main UI ----------------------- */
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#020617] to-[#071027] text-white pt-24 pb-12 px-6 relative">
      {/* Progress bar just below navbar */}
      <div
        className="fixed top-16 left-0 h-[4px] bg-gradient-to-r from-cyan-500 to-blue-600 z-40 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />


      <div className="max-w-5xl mx-auto">
        <motion.button
          whileHover={{ x: -6 }}
          className="flex items-center gap-2 text-gray-300 mb-6"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={16} /> Back
        </motion.button>


        {/* Hero Section */}
        <motion.header
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`rounded-2xl p-8 mb-10 bg-gradient-to-br ${article.heroGradient} shadow-2xl`}
        >
          <div className="flex items-start gap-6 flex-wrap">
            <div className="p-3 rounded-lg bg-white/10">
              {topic === "pentesting" ? (
                <Zap size={32} />
              ) : (
                <Shield size={32} />
              )}
            </div>
            <div>
              <h1 className="text-4xl font-bold leading-tight">
                {article.title}
              </h1>
              <p className="text-white/90 mt-2 max-w-2xl">
                {article.sections[0]?.body?.slice(0, 200)}...
              </p>
              <div className="mt-4 flex gap-3 flex-wrap">
                <button
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-cyan-300 flex items-center gap-2"
                  onClick={() =>
                    navigate(
                      article.category === "Attack" ? "/attack" : "/defense"
                    )
                  }
                >
                  <Rocket size={14} /> Start Lab
                </button>
                <button
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-blue-300"
                  onClick={() => {
                    const el = document.getElementById("learn");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Learn ↓
                </button>
              </div>
            </div>
          </div>
        </motion.header>


        {/* Sections */}
        <main id="learn" className="space-y-6">
          {article.sections.map((sec, idx) => (
            <SectionBlock key={sec.id} section={sec} index={idx} />
          ))}


          {/* Footer CTA */}
          <div className="mt-8 p-6 rounded-xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Ready to practice?</h3>
              <p className="text-gray-300 text-sm">
                Apply what you've learned in the interactive lab!
              </p>
            </div>
            <button
              onClick={() =>
                navigate(article.category === "Attack" ? "/attack" : "/defense")
              }
              className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-md font-semibold hover:opacity-90"
            >
              Start Lab →
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}


/* ----------------------- Section Block ----------------------- */
function SectionBlock({ section, index }) {
  const [open, setOpen] = useState(index === 0);
  const [copyMsg, setCopyMsg] = useState("");
  const [insecureInput, setInsecureInput] = useState("admin' OR '1'='1");
  const [passwordSample, setPasswordSample] = useState("password");


  const insecureQuery = useMemo(() => {
    const u = insecureInput.replace(/`/g, "");
    return `SELECT * FROM users WHERE username = '${u}' AND password = '${passwordSample}';`;
  }, [insecureInput, passwordSample]);


  const secureQuery = useMemo(
    () => ({
      sql: "SELECT * FROM users WHERE username = ? AND password = ?;",
      params: [insecureInput, passwordSample],
    }),
    [insecureInput, passwordSample]
  );


  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <button
        onClick={() => setOpen((s) => !s)}
        className="w-full text-left flex items-center justify-between"
      >
        <h2 className="text-xl font-semibold">{section.title}</h2>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>


      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          {section.body && (
            <p className="text-gray-200 mb-4 whitespace-pre-wrap">
              {section.body}
            </p>
          )}
          {section.list && (
            <ul className="list-disc pl-6 space-y-2 mb-4 text-gray-200">
              {section.list.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
          {section.code && (
            <div className="space-y-3 mb-4">
              {section.code.map((c, i) => (
                <div
                  key={i}
                  className="bg-black/60 p-3 rounded-md border border-white/10 relative"
                >
                  <div className="text-sm font-mono text-gray-100">{c.cmd}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-400">{c.note}</span>
                    <button
                      onClick={() => copyToClipboard(c.cmd, setCopyMsg)}
                      className="px-2 py-1 bg-cyan-700/30 hover:bg-cyan-700/50 rounded text-cyan-300 text-xs"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                </div>
              ))}
              {copyMsg && (
                <div className="text-sm text-green-300 mt-1">{copyMsg}</div>
              )}
            </div>
          )}
          {section.visual && (
            <div className="bg-black/40 border border-white/10 rounded-md p-4">
              <h4 className="font-semibold mb-3 text-cyan-300">
                SQL Injection Visualizer
              </h4>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <input
                  value={insecureInput}
                  onChange={(e) => setInsecureInput(e.target.value)}
                  className="p-2 rounded-md bg-black/60 border border-cyan-700/50 text-sm text-white"
                  placeholder="Enter username payload"
                />
                <input
                  value={passwordSample}
                  onChange={(e) => setPasswordSample(e.target.value)}
                  className="p-2 rounded-md bg-black/60 border border-cyan-700/50 text-sm text-white"
                  placeholder="Enter password"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4 font-mono text-sm">
                <div className="bg-black/80 border border-red-600/40 p-3 rounded-md">
                  <h5 className="text-red-400 font-semibold mb-2">
                    ❌ Insecure Query
                  </h5>
                  <code>{insecureQuery}</code>
                </div>
                <div className="bg-black/80 border border-green-600/40 p-3 rounded-md">
                  <h5 className="text-green-400 font-semibold mb-2">
                    ✅ Secure Query
                  </h5>
                  <code>
                    {secureQuery.sql}
                    {"\n"}-- params: {JSON.stringify(secureQuery.params)}
                  </code>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
