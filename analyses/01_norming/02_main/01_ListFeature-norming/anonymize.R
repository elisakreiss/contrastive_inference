library(tidyverse)
library(here)

df_1 = read_csv(here("data","01_norming","02_main","01_ListFeature-norming","raw1.csv"))
df_2 = read_csv(here("data","01_norming","02_main","01_ListFeature-norming","raw2.csv"))

df = bind_rows(df_1,df_2)

anonymous_df = df %>%
  group_by(worker_id) %>% 
  mutate(anon_worker_id = ifelse(is.na(worker_id),
                                 NA,
                                 paste(sample(0:9,15,replace=TRUE),collapse = "")
                                 )) %>% 
  ungroup() %>% 
  select(-worker_id,-assignment_id,-submission_id,-hit_id,-experiment_id)

write.csv(anonymous_df, file = here("data","01_norming","02_main","01_ListFeature-norming","data.csv"), row.names = FALSE)
