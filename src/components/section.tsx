import { hygraphClient } from "@/lib/hygraphClient";
import { cn } from "@/lib/utils";
import { gql } from "graphql-request";
import CtaButton from "./cta-button";

const query = gql`
  query SectionQuery($slug: String!) {
    sections(where: { slug: $slug }) {
      id
      title
      description
      ctaButton {
        title
        href
      }
      __typename
    }
  }
`;

const getSectionBySlug = async (slug: string) => {
  const { sections } = await hygraphClient.request(query, { slug });
  return sections;
};

type SectionProps = {
  slug: string;
  className?: string;
};

const Section = async ({ slug, className, ...restProps }: SectionProps) => {
  const sections = await getSectionBySlug(slug);

  return (
    <>
      {sections.map((section) => (
        <section
          key={section.id}
          className={cn("space-y-6", className)}
          {...restProps}
        >
          <div className="space-y-5 text-center">
            <h1 className="text-5xl font-semibold">{section.title}</h1>
            <p className="text-2xl">{section.description}</p>

            <CtaButton {...section.ctaButton} />
          </div>
        </section>
      ))}
    </>
  );
};

export default Section;