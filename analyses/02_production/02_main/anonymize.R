library(tidyverse)
library(here)

df = read_csv(here("data","02_production","02_main","raw.csv"))

anonymous_df = df %>%
  group_by(worker_id) %>% 
  mutate(anon_worker_id = ifelse(is.na(worker_id),
                                 NA,
                                 paste(sample(0:9,15,replace=TRUE),collapse = "")
  )) %>% 
  ungroup() %>% 
  select(-worker_id,-assignment_id,-submission_id,-hit_id,-experiment_id)

write.csv(anonymous_df, file = here("data","02_production","02_main","data.csv"), row.names = FALSE)

df2 = read_csv(here("data","02_production","02_main","raw2.csv"))

anonymous_df2 = df2 %>%
  group_by(worker_id) %>% 
  mutate(anon_worker_id = ifelse(is.na(worker_id),
                                 NA,
                                 paste(sample(0:9,15,replace=TRUE),collapse = "")
  )) %>% 
  ungroup() %>% 
  select(-worker_id,-assignment_id,-submission_id,-hit_id,-experiment_id)

write.csv(anonymous_df2, file = here("data","02_production","02_main","data2.csv"), row.names = FALSE)
