import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  TabStopPosition,
  TabStopType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip,
  BorderStyle,
} from "docx";
import { jsPDF } from "jspdf";
import { saveAs } from "file-saver";
import { GeneratedPetition } from "./types";

function parseLetterSections(letterContent: string) {
  const lines = letterContent.split("\n");
  const sections: { type: "text" | "blank"; content: string }[] = [];

  for (const line of lines) {
    if (line.trim() === "") {
      sections.push({ type: "blank", content: "" });
    } else {
      sections.push({ type: "text", content: line });
    }
  }

  return sections;
}

function formatDate(): string {
  return new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── DOCX Generation ───────────────────────────────────────────────────────

export async function generateDocx(petition: GeneratedPetition) {
  const { representative, letterContent } = petition;
  const sections = parseLetterSections(letterContent);

  const paragraphs: Paragraph[] = [];

  for (const section of sections) {
    if (section.type === "blank") {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 120 },
          children: [],
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 80, line: 276 },
          children: [
            new TextRun({
              text: section.content,
              font: "Georgia",
              size: 24, // 12pt
              color: "1a1a1a",
            }),
          ],
        })
      );
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Georgia",
            size: 24,
            color: "1a1a1a",
          },
          paragraph: {
            spacing: { line: 276 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
            },
            size: {
              width: convertInchesToTwip(8.5),
              height: convertInchesToTwip(11),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: "CONSTITUENT PETITION",
                    font: "Georgia",
                    size: 16,
                    color: "999999",
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                border: {
                  top: {
                    color: "cccccc",
                    space: 8,
                    style: BorderStyle.SINGLE,
                    size: 1,
                  },
                },
                spacing: { before: 200 },
                children: [
                  new TextRun({
                    text: "Page ",
                    font: "Georgia",
                    size: 16,
                    color: "999999",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: "Georgia",
                    size: 16,
                    color: "999999",
                  }),
                ],
              }),
            ],
          }),
        },
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const filename = `Petition_${representative.title}_${representative.name.replace(/\s+/g, "_")}.docx`;
  saveAs(blob, filename);
}

// ─── PDF Generation ─────────────────────────────────────────────────────────

export function generatePdf(petition: GeneratedPetition) {
  const { representative, letterContent } = petition;

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "in",
    format: "letter",
  });

  // Margins
  const marginLeft = 1;
  const marginRight = 1;
  const marginTop = 1;
  const marginBottom = 1;
  const pageWidth = 8.5;
  const pageHeight = 11;
  const contentWidth = pageWidth - marginLeft - marginRight;

  // Header
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text("CONSTITUENT PETITION", pageWidth - marginRight, 0.6, {
    align: "right",
  });

  // Thin header line
  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.005);
  doc.line(marginLeft, 0.75, pageWidth - marginRight, 0.75);

  // Body text
  doc.setFont("times", "normal");
  doc.setFontSize(12);
  doc.setTextColor(26, 26, 26);

  const lines = letterContent.split("\n");
  let y = marginTop;
  const lineHeight = 0.22;
  const paragraphSpacing = 0.12;

  for (const line of lines) {
    if (line.trim() === "") {
      y += paragraphSpacing;
      continue;
    }

    // Word wrap
    const wrappedLines = doc.splitTextToSize(line, contentWidth);

    for (const wrappedLine of wrappedLines) {
      if (y > pageHeight - marginBottom - 0.5) {
        // Footer on current page
        addPdfFooter(doc, pageWidth, pageHeight, marginLeft, marginRight);
        doc.addPage();
        // Header on new page
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(153, 153, 153);
        doc.text("CONSTITUENT PETITION", pageWidth - marginRight, 0.6, {
          align: "right",
        });
        doc.setDrawColor(204, 204, 204);
        doc.setLineWidth(0.005);
        doc.line(marginLeft, 0.75, pageWidth - marginRight, 0.75);

        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(26, 26, 26);
        y = marginTop;
      }

      doc.text(wrappedLine, marginLeft, y);
      y += lineHeight;
    }
  }

  // Footer on last page
  addPdfFooter(doc, pageWidth, pageHeight, marginLeft, marginRight);

  const filename = `Petition_${representative.title}_${representative.name.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
}

function addPdfFooter(
  doc: jsPDF,
  pageWidth: number,
  pageHeight: number,
  marginLeft: number,
  marginRight: number
) {
  const currentPage = doc.getCurrentPageInfo().pageNumber;
  const footerY = pageHeight - 0.5;

  doc.setDrawColor(204, 204, 204);
  doc.setLineWidth(0.005);
  doc.line(marginLeft, footerY - 0.1, pageWidth - marginRight, footerY - 0.1);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(153, 153, 153);
  doc.text(`Page ${currentPage}`, pageWidth / 2, footerY, {
    align: "center",
  });
}

// ─── Download All ───────────────────────────────────────────────────────────

export async function downloadAllDocx(petitions: GeneratedPetition[]) {
  for (const petition of petitions) {
    await generateDocx(petition);
  }
}

export function downloadAllPdf(petitions: GeneratedPetition[]) {
  for (const petition of petitions) {
    generatePdf(petition);
  }
}
