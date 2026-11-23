import { useState } from "react";
import { motion } from "motion/react";
import { Github, Linkedin } from "lucide-react";
import { resumeContent as resume } from "../../../data/resume";
import portrait from "../../../../assets/resume/portrait.jpg";
import {
  AboutImage,
  AboutImageViewer,
  type AboutImageAsset,
} from "./AboutImage";
import { activities, credentials, degree, memoryPhotos } from "./aboutAssets";
import { usePaperLayout } from "./usePaperLayout";
import "./ResumePaperDesk.css";

export default function ResumePaperDesk() {
  const { desk, photos } = usePaperLayout(memoryPhotos.length);
  const [activeImage, setActiveImage] = useState<AboutImageAsset | null>(null);
  const entrance = {
    duration: 0.85,
    ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  };
  return (
    <motion.section
      ref={desk}
      className="resume-paper-desk"
      aria-label="정연수 이력 및 연락처"
      initial={{ opacity: 0, y: 45 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={entrance}
    >
      <motion.article
        className="resume-paper resume-profile-paper"
        initial={{ rotate: 0 }}
        animate={{ rotate: 2 }}
        transition={entrance}
      >
        <span className="resume-paper-kicker">THE PERSON BEHIND THE FILES</span>
        <div className="resume-identity">
          <img src={portrait} alt="정연수 프로필" />
          <div>
            <h2>
              {resume.name}
              <small>JEONG YEON SU</small>
            </h2>
            <p>DESIGN / DEVELOPMENT</p>
            <p>{resume.role}</p>
            <a href={`mailto:${resume.email}`}>{resume.email} ↗</a>
            <div className="resume-social-logos">
              <a
                href="https://github.com/yeonsu826"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub 프로필"
                title="GitHub"
              >
                <Github aria-hidden="true" />
              </a>
              <a
                className="is-linkedin"
                href="https://www.linkedin.com/in/yeonsu0826/"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn 프로필"
                title="LinkedIn"
              >
                <Linkedin aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
        <p className="resume-introduction">{resume.intro}</p>
      </motion.article>
      <motion.article
        className="resume-paper resume-education-paper"
        initial={{ rotate: 0 }}
        animate={{ rotate: -3 }}
        transition={{ ...entrance, delay: 0.1 }}
      >
        <span className="resume-top-tape" aria-hidden="true" />
        <span className="resume-paper-kicker">BACKGROUND / QUALIFICATIONS</span>
        <h3>
          EDUCATION<span>학력 · 교육</span>
        </h3>
        <p>{resume.school}</p>
        <AboutImage image={degree} onOpen={setActiveImage} />
      </motion.article>
      <motion.article
        className="resume-paper resume-career-paper"
        initial={{ rotate: 0 }}
        animate={{ rotate: 1 }}
        transition={{ ...entrance, delay: 0.2 }}
      >
        <span className="resume-paper-kicker">CAREER / EXPERIENCE</span>
        <h3>
          WORK EXPERIENCE<span>경력</span>
        </h3>
        <div className="resume-company-heading">
          <img
            className="resume-company-logo is-enoz"
            src={import.meta.env.BASE_URL + "images/companies/enoz.png"}
            alt="이앤오즈 ENOZ 로고"
          />
          <div>
            <h4>{resume.career.split(" / ")[0]}</h4>
            <p className="resume-company-position">
              {resume.career.split(" / ")[1]}
            </p>
          </div>
        </div>
        <p className="resume-period">{resume.period}</p>
        <p>{resume.work}</p>
        <div className="resume-previous-career">
          <div className="resume-company-heading">
            <img
              className="resume-company-logo"
              src={import.meta.env.BASE_URL + "images/companies/kaits.png"}
              alt="한국산업기술보호협회 KAITS 로고"
            />
            <div>
              <h4>{resume.previousCareer.split(" / ")[0]}</h4>
              <p className="resume-company-position">
                {resume.previousCareer.split(" / ")[1]}
              </p>
            </div>
          </div>
          <p className="resume-period">{resume.previousPeriod}</p>
          <p>{resume.previousWork}</p>
          <p className="resume-career-duties">
            주요 직무 · {resume.previousDuties}
          </p>
        </div>
        <span className="resume-paper-tape" aria-hidden="true" />
      </motion.article>
      <motion.article
        className="resume-paper resume-licenses-paper"
        initial={{ rotate: 0 }}
        animate={{ rotate: -2 }}
        transition={{ ...entrance, delay: 0.3 }}
      >
        <span className="resume-top-tape" aria-hidden="true" />
        <span className="resume-paper-kicker">CERTIFICATES / LICENSES</span>
        <h3>
          LICENSES<span>자격증</span>
        </h3>
        <div className="resume-certificate-grid">
          {credentials.map((item) => (
            <AboutImage
              key={item.source}
              image={item}
              onOpen={setActiveImage}
            />
          ))}
        </div>
      </motion.article>
      <motion.article
        className="resume-paper resume-activities-paper"
        initial={{ rotate: 0 }}
        animate={{ rotate: 2 }}
        transition={{ ...entrance, delay: 0.4 }}
      >
        <span className="resume-paper-kicker">LEARNING / ACTIVITIES</span>
        <h3>
          ACTIVITIES<span>활동 내역</span>
        </h3>
        <div className="resume-certificate-grid">
          {activities.map((item) => (
            <AboutImage
              key={item.source}
              image={item}
              onOpen={setActiveImage}
            />
          ))}
        </div>
        <span className="resume-paper-tape" aria-hidden="true" />
      </motion.article>
      <motion.article
        className="resume-paper resume-skills-paper"
        initial={{ rotate: 0 }}
        animate={{ rotate: -1 }}
        transition={{ ...entrance, delay: 0.5 }}
      >
        <span className="resume-paper-kicker">SOFTWARE / TOOLKIT</span>
        <h3>
          SOFTWARE & SKILLS<span>기술과 제작 경험</span>
        </h3>
        <div className="resume-tool-logos">
          {["Unity", "Blender", "Substance Painter", "Unreal", "React"].map(
            (tool) => (
              <figure key={tool}>
                <span
                  className={
                    tool === "Unity" || tool === "Unreal" ? "is-dark-logo" : ""
                  }
                >
                  <img
                    src={
                      import.meta.env.BASE_URL +
                      "images/icons/" +
                      (tool === "Substance Painter"
                        ? "substance"
                        : tool.toLowerCase()) +
                      ".svg"
                    }
                    alt={tool + " 로고"}
                  />
                </span>
                <figcaption>{tool}</figcaption>
              </figure>
            ),
          )}
        </div>
        <span className="resume-paper-tape" aria-hidden="true" />
      </motion.article>
      <div className="resume-memory-photos" aria-label="작업과 활동 사진">
        {photos.map((position, index) => (
          <div
            className="resume-memory-photo"
            key={memoryPhotos[index].source}
            style={{
              left: position.left,
              top: position.top,
              width: position.width,
              transform: "rotate(" + position.angle + "deg) scale(1.2)",
            }}
          >
            <AboutImage
              image={memoryPhotos[index]}
              onOpen={setActiveImage}
              photo
            />
          </div>
        ))}
      </div>
      {activeImage && (
        <AboutImageViewer
          image={activeImage}
          onClose={() => setActiveImage(null)}
        />
      )}
    </motion.section>
  );
}
