library(tidyverse)
library(here)

df = read_csv(here("data","01_norming","02_main","05_OMP-multchoice","raw.csv"),
              col_types = list(
                .default = col_character(),
                submission_id = col_double(),
                HitCorrect = col_double(),
                age = col_double(),
                endTime = col_double(),
                enjoyment = col_double(),
                experiment_id = col_double(),
                refexp1_checked = col_logical(),
                refexp2_checked = col_logical(),
                refexp3_checked = col_logical(),
                refexp4_checked = col_logical(),
                refexp_other = col_character(),
                startTime = col_double(),
                timeSpent = col_double(),
                trial_number = col_double()
              ))

anonymous_df = df %>%
  group_by(worker_id) %>% 
  mutate(anon_worker_id = ifelse(is.na(worker_id),
                                 NA,
                                 paste(sample(0:9,15,replace=TRUE),collapse = "")
                                 )) %>% 
  ungroup() %>% 
  select(-worker_id,-assignment_id,-submission_id,-hit_id,-experiment_id)

write.csv(anonymous_df, file = here("data","01_norming","02_main","05_OMP-multchoice","data.csv"), row.names = FALSE)
