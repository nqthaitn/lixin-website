-- Trigger: Auto-publish news when auto_publish_news setting is enabled
-- This handles cron jobs that INSERT directly into the news table

-- Step 1: Create the trigger function
CREATE OR REPLACE FUNCTION auto_publish_news_trigger()
RETURNS TRIGGER AS $$
DECLARE
  auto_publish TEXT;
BEGIN
  -- Only apply to auto-generated articles (from cron/external)
  IF NEW.auto_generated = true AND (NEW.status IS NULL OR NEW.status = 'draft') THEN
    -- Check the auto_publish_news setting
    SELECT value INTO auto_publish
    FROM public.site_settings
    WHERE key = 'auto_publish_news';

    IF auto_publish = 'true' THEN
      NEW.status := 'published';
      NEW.published_at := NOW();
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 2: Create the trigger on the news table
DROP TRIGGER IF EXISTS trigger_auto_publish_news ON public.news;

CREATE TRIGGER trigger_auto_publish_news
  BEFORE INSERT ON public.news
  FOR EACH ROW
  EXECUTE FUNCTION auto_publish_news_trigger();

-- Step 3: Also update existing draft auto-generated articles (optional)
-- Uncomment below to publish all existing auto-generated drafts:
UPDATE public.news
SET status = 'published', published_at = NOW()
WHERE auto_generated = true AND status = 'draft';
