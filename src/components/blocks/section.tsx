import { hygraphClient } from "@/lib/hygraphClient";
import { cn } from "@/lib/utils";
import { gql } from "graphql-request";
import CtaButton from "@/components/cta-button";

type Section = {
  id: string;
  title: string;
  description: string;
  slug: string;
  ctaButton?: {
    title: string;
    href: string;
  };
};

const getSectionBySlug = async (slug: string, locale: string, id: string) => {
  const query = gql`
    query SectionQuery($slug: String!, $id: ID!, $locale: Locale!) {
      sections(where: { slug: $slug, id: $id }, locales: [$locale]) {
        slug
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

  const { sections } = await hygraphClient.request<{ sections: Section[] }>(
    query,
    { slug, id, locale },
  );
  return sections;
};

type SectionProps = {
  slug: string;
  id: string;
  className?: string;
  locale: string;
};

const Section = async ({
  slug,
  locale,
  id,
  className,
  ...restProps
}: SectionProps) => {
  const sections = await getSectionBySlug(slug, locale, id);

  return (
    <>
      {sections.map((section) => (
        <section
          key={id}
          className={cn("space-y-6 max-w-4xl mx-auto py-8", className)}
          {...restProps}
        >
          <div className="space-y-5 text-center">
            <h1 className="text-5xl font-semibold">{section.title}</h1>
            <p className="text-xl">{section.description}</p>

            {section.ctaButton && <CtaButton {...section.ctaButton} />}
          </div>
        </section>
      ))}
    </>
  );
};

export default Section;
