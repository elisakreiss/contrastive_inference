library(tidyverse)
library(here)

df = read_csv(here("data","03_comprehension","02_main","03_IDTnoprior","raw.csv"))

anonymous_df = df %>%
  group_by(worker_id) %>% 
  mutate(anon_worker_id = ifelse(is.na(worker_id),
                                 NA,
                                 paste(sample(0:9,15,replace=TRUE),collapse = "")
  )) %>% 
  ungroup() %>% 
  select(-worker_id,-assignment_id,-submission_id,-hit_id,-experiment_id)

write.csv(anonymous_df, file = here("data","03_comprehension","02_main","03_IDTnoprior","data.csv"), row.names = FALSE)
